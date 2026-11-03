export type SensitivityLevel = 'public' | 'private' | 'confidential';

export type FileCategory = 'document' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'other';

export type SharePermission = 'view' | 'download';

export type ActivityAction =
  | 'file_uploaded'
  | 'file_downloaded'
  | 'file_shared'
  | 'file_deleted'
  | 'file_renamed'
  | 'file_moved'
  | 'access_granted'
  | 'access_revoked'
  | 'public_link_generated'
  | 'public_link_blocked';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  storageQuotaBytes: number; // default 5 GB
  storageUsedBytes: number;
}

export interface CloudFile {
  id: string;
  name: string;
  ownerId: string;
  ownerEmail: string;
  ownerName: string;
  folderId: string | null;
  storagePath: string;
  downloadUrl?: string;
  size: number; // in bytes
  type: string; // MIME type
  category: FileCategory;
  sensitivity: SensitivityLevel;
  isStarred?: boolean;
  sharedWithEmails: string[];
  publicShareToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  ownerId: string;
  parentId: string | null;
  color?: string;
  fileCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileShare {
  id: string;
  fileId: string;
  fileName: string;
  ownerId: string;
  ownerEmail: string;
  sharedWith: string; // recipient email
  permission: SharePermission;
  sensitivity: SensitivityLevel;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  fileId?: string;
  fileName?: string;
  action: ActivityAction;
  details: string;
  sensitivity?: SensitivityLevel;
  timestamp: string;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason: string;
  ruleViolated?: string;
  level: SensitivityLevel;
}

export interface StorageBreakdown {
  documents: number;
  images: number;
  videos: number;
  others: number;
  totalUsed: number;
  quota: number;
}
