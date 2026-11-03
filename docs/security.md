# CloudVault Security Specification & Threat Model

## 1. Security Philosophy

CloudVault implements a **defense-in-depth academic security model**. The primary design objective is mitigating **Accidental Public Exposure** and **Insecure Direct Object References (IDOR / BOLA)** through strict **Sensitivity-Based Access Control (SBAC)** and dual-layer authorization rules.

The system does not claim uncrackable military-grade secrecy; it is designed and documented as an academic research prototype demonstrating verifiable improvements over basic unrestricted cloud sharing.

---

## 2. Sensitivity-Based Access Control (SBAC) Matrix

| Operation | Public Tier | Private Tier | Confidential Tier |
|---|---|---|---|
| **Owner Access** | Full (Read, Download, Edit, Delete) | Full (Read, Download, Edit, Delete) | Full (Read, Download, Edit, Delete) |
| **Whitelisted User Access** | Read & Download | As granted (View / Download) | Strictly verified direct grant |
| **Unauthenticated / Anonymous Access** | Permitted via valid public link | **Strictly Forbidden** (403) | **Permanently Prohibited** (403) |
| **Public Link Creation** | **Allowed** | **Blocked by Policy** | **Blocked by Policy** |
| **Access Revocation** | Immediate token invalidation | Whitelist removal in real-time | Whitelist removal + audit log |
| **Tampered File ID Query** | Denied (No token) | Denied (IDOR check fails) | Denied (Strict 403 response) |

---

## 3. Threat Model & Mitigations

### 3.1 Insecure Direct Object Reference (IDOR / BOLA)
- **Threat Vector**: An authenticated user (User B) manually edits the file ID in an API request or browser URL to access a private file owned by User A.
- **CloudVault Mitigation**: Access is evaluated against the `files` document metadata and `request.auth.uid`. If User B's identity does not match `file.ownerId` and is absent from `file.sharedWithEmails`, access is rejected immediately with a 403 Forbidden status.

### 3.2 Accidental Link Exposure
- **Threat Vector**: A student mistakenly generates a public URL for a confidential thesis draft or grade transcript, exposing it to search engines or unwanted recipients.
- **CloudVault Mitigation**: The Sensitivity-Based Access Control engine forbids public token generation on files classified as **Private** or **Confidential**. The UI blocks the button, and the backend policy rejects any unauthenticated request.

### 3.3 Access Revocation Delay
- **Threat Vector**: An owner revokes access from a collaborator, but the collaborator retains access due to cached sessions or persistent links.
- **CloudVault Mitigation**: Direct sharing grants are managed in real-time within the `shares` collection and synchronized with the file's `sharedWithEmails` array. Removing a share instantly denies further access.

---

## 4. Firebase Rules Enforcement

### 4.1 Firestore Rules
- Strict checks on `ownerId == request.auth.uid`
- Read policy branches based on `resource.data.sensitivity == 'public'` vs authenticated membership in `sharedWithEmails`.
- Writes, updates, and deletes are restricted exclusively to file owners.

### 4.2 Storage Rules
- Object storage path follows: `/files/{userId}/{fileId}/{filename}`.
- Max payload size enforced at rule boundary (< 25 MB).
- Prevent unauthorized bucket traversals.
