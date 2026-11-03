# CloudVault System Architecture

## 1. Overview

**CloudVault** is designed as a clean, reliable, and easily explainable cloud file storage and sharing platform built for academic and secure collaborative use.

The architecture strictly follows a decoupled cloud-native paradigm:
- **Presentation Layer**: Next.js (React 19, TypeScript, Tailwind CSS)
- **Identity & Authentication**: Firebase Authentication
- **Data & Metadata Layer**: Firebase Firestore
- **Blob Object Storage**: Firebase Cloud Storage
- **Policy Enforcement**: Sensitivity-Based Access Control (SBAC) Engine

---

## 2. High-Level Architecture Diagram

```mermaid
graph TD
    User["Client / Web Browser"] --> NextJS["Next.js Web Application (Vercel)"]
    
    subgraph "Cloud Security Perimeter"
        NextJS --> Auth["Firebase Authentication (Identity Verification)"]
        NextJS --> SBAC["Sensitivity-Based Access Control Engine (SBAC)"]
        
        SBAC --> Firestore[("Firebase Firestore (Metadata & Policies)")]
        SBAC --> CloudStorage[("Firebase Cloud Storage (Encrypted Objects)")]
        
        Firestore --> AuditTrail["Activity Audit History Log"]
    end
    
    style User fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style NextJS fill:#f8fafc,stroke:#475569,stroke-width:2px
    style SBAC fill:#fef3c7,stroke:#d97706,stroke-width:2px
    style Firestore fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style CloudStorage fill:#dcfce7,stroke:#16a34a,stroke-width:2px
```

---

## 3. Core Operational Flows

### 3.1 File Upload & Classification Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Next.js Client
    participant Auth as Firebase Auth
    participant SBAC as SBAC Policy Engine
    participant Store as Cloud Storage
    participant DB as Firestore DB

    User->>App: Select File & Sensitivity (Public / Private / Confidential)
    App->>Auth: Verify active user session
    Auth-->>App: Session valid (User UID & Token)
    App->>SBAC: Validate file attributes (type, size < 25MB, sensitivity)
    SBAC-->>App: Validation passed
    App->>Store: Upload raw byte stream to /files/{uid}/{fileId}/
    Store-->>App: Return Storage Path & Download URL
    App->>DB: Persist metadata record in 'files' collection
    App->>DB: Record 'file_uploaded' in 'activities' audit trail
    App-->>User: Display successful upload & update dashboard quota
```

---

### 3.2 File Access & Retrieval Flow (Enforcing SBAC)

```mermaid
sequenceDiagram
    autonumber
    actor Requester
    participant Gatekeeper as SBAC Gatekeeper
    participant DB as Firestore
    participant Storage as Cloud Storage

    Requester->>Gatekeeper: Request file access (File ID + Credentials/Token)
    Gatekeeper->>DB: Fetch file metadata record
    DB-->>Gatekeeper: Return ownerId, sensitivity, sharedWithEmails

    alt Public Link Request
        alt File is marked PUBLIC
            Gatekeeper-->>Requester: 200 OK (Access Allowed via verified token)
        else File is marked PRIVATE or CONFIDENTIAL
            Gatekeeper-->>Requester: 403 Forbidden (Public Link Blocked by Policy)
        end
    else Authenticated Direct Access
        alt Requester == File Owner
            Gatekeeper-->>Requester: 200 OK (Full Owner Access)
        else Requester Email in sharedWithEmails
            Gatekeeper-->>Requester: 200 OK (Authorized Collaborator Access)
        else Unauthorized User
            Gatekeeper-->>Requester: 403 Forbidden (Unauthorized Access Blocked)
        end
    end
```

---

### 3.3 File Sharing Flow

```mermaid
sequenceDiagram
    autonumber
    actor Owner
    participant App as Next.js UI
    participant Policy as SBAC Validator
    participant DB as Firestore

    Owner->>App: Select "Share File"
    alt Request Public Share Link
        App->>Policy: canCreatePublicLink(file.sensitivity)
        alt Sensitivity == 'public'
            Policy-->>App: Allowed (Generate & Return Public URL)
            App->>DB: Record publicShareToken & log activity
            App-->>Owner: Display shareable public link
        else Sensitivity == 'private' or 'confidential'
            Policy-->>App: BLOCKED (Security Policy Violation)
            App-->>Owner: Show warning: Public link prohibited for non-public files
        end
    else Direct User-to-User Share
        Owner->>App: Input recipient email & permission (View/Download)
        App->>DB: Insert record in 'shares' collection
        App->>DB: Append recipient email to file.sharedWithEmails
        App->>DB: Log 'access_granted' in 'activities'
        App-->>Owner: Access granted successfully
    end
```

---

## 4. Firestore Database Schema

The database model is kept intentionally simple, normalized, and relational-friendly:

```mermaid
erDiagram
    USERS ||--o{ FILES : owns
    USERS ||--o{ FOLDERS : creates
    USERS ||--o{ SHARES : grants
    USERS ||--o{ ACTIVITIES : triggers
    FOLDERS ||--o{ FILES : contains
    FILES ||--o{ SHARES : shared_via

    USERS {
        string uid PK
        string name
        string email
        timestamp createdAt
        int storageQuotaBytes
        int storageUsedBytes
    }

    FILES {
        string id PK
        string name
        string ownerId FK
        string ownerEmail
        string folderId FK
        string storagePath
        int size
        string type
        string category
        string sensitivity "public | private | confidential"
        boolean isStarred
        list sharedWithEmails
        string publicShareToken
        timestamp createdAt
        timestamp updatedAt
    }

    FOLDERS {
        string id PK
        string name
        string ownerId FK
        string parentId FK
        string color
        timestamp createdAt
        timestamp updatedAt
    }

    SHARES {
        string id PK
        string fileId FK
        string ownerId FK
        string sharedWith
        string permission "view | download"
        string sensitivity
        timestamp createdAt
    }

    ACTIVITIES {
        string id PK
        string userId FK
        string userEmail
        string fileId FK
        string fileName
        string action "uploaded | shared | revoked | deleted"
        string details
        string sensitivity
        timestamp timestamp
    }
```
