import { AccessCheckResult, CloudFile, SensitivityLevel, UserProfile } from '@/types';

/**
 * CloudVault Sensitivity-Based Access Control (SBAC) Engine
 * 
 * Formal Policy Definition:
 * -------------------------------------------------------------
 * Level 1: PUBLIC
 *   - Read Access: Owner, authorized users, or anyone holding a valid public share link.
 *   - Share Capability: Direct email share OR public share link generation.
 *   - Revocation: Public link can be disabled anytime.
 * 
 * Level 2: PRIVATE
 *   - Read Access: File Owner OR explicitly authenticated users with granted access.
 *   - Share Capability: Direct user-to-user email share ONLY (with View or Download permission).
 *   - Public Link Generation: STRICTLY BLOCKED.
 * 
 * Level 3: CONFIDENTIAL
 *   - Read Access: Strictly File Owner OR explicitly authorized, verified recipient users.
 *   - Share Capability: Direct user-to-user email share ONLY with audit logged approval.
 *   - Public Link Generation: STRICTLY BLOCKED by system policy and rejected at API/UI boundaries.
 */

export function canCreatePublicLink(sensitivity: SensitivityLevel): { allowed: boolean; reason: string } {
  if (sensitivity === 'public') {
    return {
      allowed: true,
      reason: 'File sensitivity is set to Public. Unrestricted share link is permissible.',
    };
  }

  if (sensitivity === 'private') {
    return {
      allowed: false,
      reason: 'Security Violation: Private files cannot be shared via public links. Use direct user-to-user email sharing.',
    };
  }

  return {
    allowed: false,
    reason: 'Critical Policy Enforcement: Confidential files are restricted to designated registered users only. Public links are permanently prohibited.',
  };
}

export function evaluateFileAccess({
  file,
  user,
  isPublicLinkRequest = false,
  publicToken = null,
}: {
  file: CloudFile;
  user: UserProfile | null;
  isPublicLinkRequest?: boolean;
  publicToken?: string | null;
}): AccessCheckResult {
  // Scenario 1: Public Link Access
  if (isPublicLinkRequest) {
    if (file.sensitivity !== 'public') {
      return {
        allowed: false,
        level: file.sensitivity,
        reason: `Access Denied: The requested file is classified as '${file.sensitivity.toUpperCase()}'. Sensitivity-Based Access Control (SBAC) strictly forbids public link access for non-public assets.`,
        ruleViolated: 'SBAC_RULE_PUBLIC_LINK_RESTRICTION',
      };
    }

    if (!file.publicShareToken || file.publicShareToken !== publicToken) {
      return {
        allowed: false,
        level: file.sensitivity,
        reason: 'Access Denied: Invalid or expired public share link token.',
        ruleViolated: 'SBAC_RULE_INVALID_TOKEN',
      };
    }

    return {
      allowed: true,
      level: file.sensitivity,
      reason: 'Access Granted: Public asset accessed via verified public token.',
    };
  }

  // Scenario 2: Authenticated Access
  if (!user) {
    return {
      allowed: false,
      level: file.sensitivity,
      reason: 'Access Denied: Authentication required. User identity is unverified.',
      ruleViolated: 'SBAC_RULE_UNAUTHENTICATED',
    };
  }

  // File Owner check: Owner always has full access
  if (file.ownerId === user.uid || file.ownerEmail.toLowerCase() === user.email.toLowerCase()) {
    return {
      allowed: true,
      level: file.sensitivity,
      reason: 'Access Granted: User is the verified file owner.',
    };
  }

  // Shared With check (Direct user grant)
  const isDirectlyShared = file.sharedWithEmails.some(
    (e) => e.toLowerCase() === user.email.toLowerCase()
  );

  if (isDirectlyShared) {
    return {
      allowed: true,
      level: file.sensitivity,
      reason: `Access Granted: User is explicitly authorized for this ${file.sensitivity} file.`,
    };
  }

  // If not owner and not in shared list:
  return {
    allowed: false,
    level: file.sensitivity,
    reason: `Access Denied: User (${user.email}) is not authorized to access this ${file.sensitivity} file. File ID parameter tampering detected or access revoked.`,
    ruleViolated: 'SBAC_RULE_UNAUTHORIZED_RECIPIENT',
  };
}

export interface ExperimentResult {
  id: number;
  title: string;
  description: string;
  testCase: string;
  expectedResult: string;
  actualResult: string;
  status: 'PASS' | 'FAIL';
  executionTimeMs: number;
  sensitivity: SensitivityLevel;
  details: string;
}

/**
 * Executes the 5 standard B.Tech Viva Research Experiments programmatically
 * to produce genuine, verifiable evaluation data.
 */
export function runResearchExperiments(): ExperimentResult[] {
  const mockOwner: UserProfile = {
    uid: 'user-a-owner',
    name: 'Alice (Owner)',
    email: 'alice@cloudvault.edu',
    createdAt: new Date().toISOString(),
    storageQuotaBytes: 5368709120,
    storageUsedBytes: 154200000,
  };

  const mockUnauthorizedUser: UserProfile = {
    uid: 'user-b-unauthorized',
    name: 'Bob (Attacker/Unauthorized)',
    email: 'bob@cloudvault.edu',
    createdAt: new Date().toISOString(),
    storageQuotaBytes: 5368709120,
    storageUsedBytes: 50000000,
  };

  const mockAuthorizedUser: UserProfile = {
    uid: 'user-c-authorized',
    name: 'Charlie (Authorized Collaborator)',
    email: 'charlie@cloudvault.edu',
    createdAt: new Date().toISOString(),
    storageQuotaBytes: 5368709120,
    storageUsedBytes: 80000000,
  };

  const results: ExperimentResult[] = [];

  // Experiment 1: Unauthorized Access Prevention
  {
    const start = performance.now();
    const privateFile: CloudFile = {
      id: 'file-exp-1',
      name: 'Financial_Audit_2026.pdf',
      ownerId: mockOwner.uid,
      ownerEmail: mockOwner.email,
      ownerName: mockOwner.name,
      folderId: null,
      storagePath: 'files/user-a-owner/file-exp-1/Financial_Audit_2026.pdf',
      size: 2450000,
      type: 'application/pdf',
      category: 'document',
      sensitivity: 'private',
      sharedWithEmails: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const evalResult = evaluateFileAccess({
      file: privateFile,
      user: mockUnauthorizedUser,
    });
    const time = Math.round(performance.now() - start);

    results.push({
      id: 1,
      title: 'Experiment 1 — Unauthorized Access Prevention',
      description: 'User A owns a private file. User B (unauthorized) attempts to inspect or download it.',
      testCase: 'Private file access with non-owner and non-authorized UID',
      expectedResult: 'ACCESS DENIED',
      actualResult: evalResult.allowed ? 'ACCESS GRANTED' : 'ACCESS DENIED',
      status: !evalResult.allowed ? 'PASS' : 'FAIL',
      executionTimeMs: Math.max(time, 1),
      sensitivity: 'private',
      details: evalResult.reason,
    });
  }

  // Experiment 2: Authorized Access Validation
  {
    const start = performance.now();
    const sharedFile: CloudFile = {
      id: 'file-exp-2',
      name: 'Research_Paper_Draft.docx',
      ownerId: mockOwner.uid,
      ownerEmail: mockOwner.email,
      ownerName: mockOwner.name,
      folderId: null,
      storagePath: 'files/user-a-owner/file-exp-2/Research_Paper_Draft.docx',
      size: 1120000,
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      category: 'document',
      sensitivity: 'private',
      sharedWithEmails: [mockAuthorizedUser.email],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const evalResult = evaluateFileAccess({
      file: sharedFile,
      user: mockAuthorizedUser,
    });
    const time = Math.round(performance.now() - start);

    results.push({
      id: 2,
      title: 'Experiment 2 — Authorized User Access',
      description: 'User A shares a private document with User C. User C accesses the file.',
      testCase: 'Private file accessed by verified shared email identity',
      expectedResult: 'ACCESS GRANTED',
      actualResult: evalResult.allowed ? 'ACCESS GRANTED' : 'ACCESS DENIED',
      status: evalResult.allowed ? 'PASS' : 'FAIL',
      executionTimeMs: Math.max(time, 1),
      sensitivity: 'private',
      details: evalResult.reason,
    });
  }

  // Experiment 3: Revoked Access Enforcement
  {
    const start = performance.now();
    const revokedFile: CloudFile = {
      id: 'file-exp-3',
      name: 'Patent_Application_V2.pdf',
      ownerId: mockOwner.uid,
      ownerEmail: mockOwner.email,
      ownerName: mockOwner.name,
      folderId: null,
      storagePath: 'files/user-a-owner/file-exp-3/Patent_Application_V2.pdf',
      size: 4200000,
      type: 'application/pdf',
      category: 'document',
      sensitivity: 'confidential',
      // User C was previously shared, now revoked (empty list)
      sharedWithEmails: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const evalResult = evaluateFileAccess({
      file: revokedFile,
      user: mockAuthorizedUser,
    });
    const time = Math.round(performance.now() - start);

    results.push({
      id: 3,
      title: 'Experiment 3 — Revoked Access Enforcement',
      description: 'User A removes User C permission. User C attempts access after revocation.',
      testCase: 'Access evaluated after removing collaborator email from whitelist',
      expectedResult: 'ACCESS DENIED',
      actualResult: evalResult.allowed ? 'ACCESS GRANTED' : 'ACCESS DENIED',
      status: !evalResult.allowed ? 'PASS' : 'FAIL',
      executionTimeMs: Math.max(time, 1),
      sensitivity: 'confidential',
      details: evalResult.reason,
    });
  }

  // Experiment 4 — Public File Link Access
  {
    const start = performance.now();
    const publicFile: CloudFile = {
      id: 'file-exp-4',
      name: 'Open_Source_Cheatsheet.pdf',
      ownerId: mockOwner.uid,
      ownerEmail: mockOwner.email,
      ownerName: mockOwner.name,
      folderId: null,
      storagePath: 'files/user-a-owner/file-exp-4/Open_Source_Cheatsheet.pdf',
      size: 890000,
      type: 'application/pdf',
      category: 'document',
      sensitivity: 'public',
      publicShareToken: 'pub-token-xyz-123',
      sharedWithEmails: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const evalResult = evaluateFileAccess({
      file: publicFile,
      user: null, // Anonymous recipient using public link
      isPublicLinkRequest: true,
      publicToken: 'pub-token-xyz-123',
    });
    const time = Math.round(performance.now() - start);

    results.push({
      id: 4,
      title: 'Experiment 4 — Public File Link Access',
      description: 'User A uploads a Public file and shares via public link. Anonymous user accesses it.',
      testCase: 'Unrestricted public token validation for Public sensitivity tier',
      expectedResult: 'ACCESS ALLOWED',
      actualResult: evalResult.allowed ? 'ACCESS ALLOWED' : 'ACCESS DENIED',
      status: evalResult.allowed ? 'PASS' : 'FAIL',
      executionTimeMs: Math.max(time, 1),
      sensitivity: 'public',
      details: evalResult.reason,
    });
  }

  // Experiment 5 — Confidential File Public Link Prevention
  {
    const start = performance.now();
    const linkCheck = canCreatePublicLink('confidential');
    const time = Math.round(performance.now() - start);

    results.push({
      id: 5,
      title: 'Experiment 5 — Confidential Public Link Prevention',
      description: 'User A uploads a Confidential file and attempts to generate an unrestricted public link.',
      testCase: 'Enforce non-shareability barrier on Confidential sensitivity level',
      expectedResult: 'PUBLIC SHARING BLOCKED',
      actualResult: !linkCheck.allowed ? 'PUBLIC SHARING BLOCKED' : 'LINK CREATED',
      status: !linkCheck.allowed ? 'PASS' : 'FAIL',
      executionTimeMs: Math.max(time, 1),
      sensitivity: 'confidential',
      details: linkCheck.reason,
    });
  }

  return results;
}
