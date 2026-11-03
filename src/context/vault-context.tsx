'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ActivityAction,
  ActivityLog,
  CloudFile,
  FileCategory,
  FileShare,
  Folder,
  SensitivityLevel,
  SharePermission,
  StorageBreakdown,
} from '@/types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_FILES,
  INITIAL_FOLDERS,
  INITIAL_SHARES,
} from '@/lib/mock-data';
import { getFileCategory } from '@/lib/utils';
import { canCreatePublicLink } from '@/lib/sensitivity';
import { useAuth } from './auth-context';

interface VaultContextType {
  files: CloudFile[];
  folders: Folder[];
  shares: FileShare[];
  activities: ActivityLog[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sensitivityFilter: 'all' | SensitivityLevel;
  setSensitivityFilter: (s: 'all' | SensitivityLevel) => void;
  categoryFilter: 'all' | FileCategory;
  setCategoryFilter: (c: 'all' | FileCategory) => void;
  viewMode: 'table' | 'grid';
  setViewMode: (m: 'table' | 'grid') => void;

  // File operations
  uploadFile: (file: File, folderId: string | null, sensitivity: SensitivityLevel) => Promise<CloudFile>;
  deleteFile: (fileId: string) => Promise<void>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  moveFile: (fileId: string, targetFolderId: string | null) => Promise<void>;
  toggleStar: (fileId: string) => Promise<void>;
  downloadFile: (file: CloudFile) => void;

  // Sharing & Access Control
  shareFileWithUser: (
    fileId: string,
    recipientEmail: string,
    permission: SharePermission
  ) => Promise<{ success: boolean; message: string }>;
  revokeShare: (shareId: string) => Promise<void>;
  generatePublicLink: (fileId: string) => { success: boolean; url?: string; message: string };
  disablePublicLink: (fileId: string) => Promise<void>;

  // Folder operations
  createFolder: (name: string, color?: string) => Promise<Folder>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;

  // Metrics
  storageBreakdown: StorageBreakdown;
  sharedWithMeFiles: CloudFile[];
  recentFiles: CloudFile[];
  starredFiles: CloudFile[];
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [files, setFiles] = useState<CloudFile[]>(INITIAL_FILES);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [shares, setShares] = useState<FileShare[]>(INITIAL_SHARES);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sensitivityFilter, setSensitivityFilter] = useState<'all' | SensitivityLevel>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | FileCategory>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Load from localStorage if present (for persistent demo on browser refresh)
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem('cloudvault_files');
      if (savedFiles) setFiles(JSON.parse(savedFiles));

      const savedFolders = localStorage.getItem('cloudvault_folders');
      if (savedFolders) setFolders(JSON.parse(savedFolders));

      const savedShares = localStorage.getItem('cloudvault_shares');
      if (savedShares) setShares(JSON.parse(savedShares));

      const savedActivities = localStorage.getItem('cloudvault_activities');
      if (savedActivities) setActivities(JSON.parse(savedActivities));
    } catch {
      // LocalStorage unavailable, use in-memory state
    }
  }, []);

  const saveToStorage = (
    newFiles?: CloudFile[],
    newFolders?: Folder[],
    newShares?: FileShare[],
    newActivities?: ActivityLog[]
  ) => {
    try {
      if (newFiles) localStorage.setItem('cloudvault_files', JSON.stringify(newFiles));
      if (newFolders) localStorage.setItem('cloudvault_folders', JSON.stringify(newFolders));
      if (newShares) localStorage.setItem('cloudvault_shares', JSON.stringify(newShares));
      if (newActivities) localStorage.setItem('cloudvault_activities', JSON.stringify(newActivities));
    } catch {}
  };

  const logActivity = (
    action: ActivityAction,
    fileId?: string,
    fileName?: string,
    details: string = '',
    sensitivity?: SensitivityLevel
  ) => {
    const newAct: ActivityLog = {
      id: 'act-' + Date.now(),
      userId: profile?.uid || 'usr-student-001',
      userEmail: profile?.email || 'aayushi.sharma@btech.edu',
      userName: profile?.name || 'Aayushi Sharma',
      fileId,
      fileName,
      action,
      details,
      sensitivity,
      timestamp: new Date().toISOString(),
    };

    setActivities((prev) => {
      const updated = [newAct, ...prev];
      saveToStorage(undefined, undefined, undefined, updated);
      return updated;
    });
  };

  // File Operations
  const uploadFile = async (
    file: File,
    folderId: string | null,
    sensitivity: SensitivityLevel
  ): Promise<CloudFile> => {
    const category = getFileCategory(file.type, file.name);
    const newFile: CloudFile = {
      id: 'file-' + Date.now(),
      name: file.name,
      ownerId: profile?.uid || 'usr-student-001',
      ownerEmail: profile?.email || 'aayushi.sharma@btech.edu',
      ownerName: profile?.name || 'Aayushi Sharma',
      folderId: folderId,
      storagePath: `files/${profile?.uid || 'usr-student-001'}/${file.name}`,
      downloadUrl: URL.createObjectURL(file),
      size: file.size,
      type: file.type || 'application/octet-stream',
      category,
      sensitivity,
      isStarred: false,
      sharedWithEmails: [],
      publicShareToken: sensitivity === 'public' ? 'pub-' + Math.random().toString(36).substring(2, 9) : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFiles((prev) => {
      const updated = [newFile, ...prev];
      saveToStorage(updated);
      return updated;
    });

    logActivity(
      'file_uploaded',
      newFile.id,
      newFile.name,
      `Uploaded file with ${sensitivity.toUpperCase()} sensitivity classification.`,
      sensitivity
    );

    return newFile;
  };

  const deleteFile = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== fileId);
      saveToStorage(updated);
      return updated;
    });

    // Clean up associated shares
    setShares((prev) => {
      const updated = prev.filter((s) => s.fileId !== fileId);
      saveToStorage(undefined, undefined, updated);
      return updated;
    });

    logActivity('file_deleted', fileId, file.name, 'File deleted from vault.', file.sensitivity);
  };

  const renameFile = async (fileId: string, newName: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    const oldName = file.name;
    setFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === fileId ? { ...f, name: newName, updatedAt: new Date().toISOString() } : f
      );
      saveToStorage(updated);
      return updated;
    });

    logActivity(
      'file_renamed',
      fileId,
      newName,
      `Renamed file from "${oldName}" to "${newName}".`,
      file.sensitivity
    );
  };

  const moveFile = async (fileId: string, targetFolderId: string | null) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    setFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === fileId ? { ...f, folderId: targetFolderId, updatedAt: new Date().toISOString() } : f
      );
      saveToStorage(updated);
      return updated;
    });

    const targetFolder = folders.find((f) => f.id === targetFolderId);
    logActivity(
      'file_moved',
      fileId,
      file.name,
      `Moved to folder "${targetFolder ? targetFolder.name : 'Root'}"`,
      file.sensitivity
    );
  };

  const toggleStar = async (fileId: string) => {
    setFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === fileId ? { ...f, isStarred: !f.isStarred } : f
      );
      saveToStorage(updated);
      return updated;
    });
  };

  const downloadFile = (file: CloudFile) => {
    logActivity(
      'file_downloaded',
      file.id,
      file.name,
      `File downloaded by ${profile?.email || 'authenticated user'}.`,
      file.sensitivity
    );

    // Trigger browser download
    if (file.downloadUrl) {
      const a = document.createElement('a');
      a.href = file.downloadUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Mock download dummy blob
      const blob = new Blob([`Content of ${file.name}\nSensitivity: ${file.sensitivity}`], {
        type: file.type,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Sharing
  const shareFileWithUser = async (
    fileId: string,
    recipientEmail: string,
    permission: SharePermission
  ): Promise<{ success: boolean; message: string }> => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return { success: false, message: 'File not found' };

    const cleanEmail = recipientEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    if (file.sharedWithEmails.includes(cleanEmail)) {
      return { success: false, message: `File is already shared with ${cleanEmail}` };
    }

    const newShare: FileShare = {
      id: 'shr-' + Date.now(),
      fileId: file.id,
      fileName: file.name,
      ownerId: file.ownerId,
      ownerEmail: file.ownerEmail,
      sharedWith: cleanEmail,
      permission,
      sensitivity: file.sensitivity,
      createdAt: new Date().toISOString(),
    };

    setShares((prev) => {
      const updated = [newShare, ...prev];
      saveToStorage(undefined, undefined, updated);
      return updated;
    });

    setFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === fileId ? { ...f, sharedWithEmails: [...f.sharedWithEmails, cleanEmail] } : f
      );
      saveToStorage(updated);
      return updated;
    });

    logActivity(
      'file_shared',
      file.id,
      file.name,
      `Shared with ${cleanEmail} (${permission.toUpperCase()} permission).`,
      file.sensitivity
    );

    return {
      success: true,
      message: `Successfully granted ${permission} access to ${cleanEmail}`,
    };
  };

  const revokeShare = async (shareId: string) => {
    const share = shares.find((s) => s.id === shareId);
    if (!share) return;

    setShares((prev) => {
      const updated = prev.filter((s) => s.id !== shareId);
      saveToStorage(undefined, undefined, updated);
      return updated;
    });

    setFiles((prev) => {
      const updated = prev.map((f) => {
        if (f.id === share.fileId) {
          return {
            ...f,
            sharedWithEmails: f.sharedWithEmails.filter(
              (e) => e.toLowerCase() !== share.sharedWith.toLowerCase()
            ),
          };
        }
        return f;
      });
      saveToStorage(updated);
      return updated;
    });

    logActivity(
      'access_revoked',
      share.fileId,
      share.fileName,
      `Revoked access from ${share.sharedWith}.`,
      share.sensitivity
    );
  };

  const generatePublicLink = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return { success: false, message: 'File not found' };

    const check = canCreatePublicLink(file.sensitivity);
    if (!check.allowed) {
      logActivity(
        'public_link_blocked',
        file.id,
        file.name,
        `Public link blocked: ${file.sensitivity.toUpperCase()} files cannot be exposed via public links.`,
        file.sensitivity
      );
      return { success: false, message: check.reason };
    }

    let token = file.publicShareToken;
    if (!token) {
      token = 'pub-' + Math.random().toString(36).substring(2, 9);
      setFiles((prev) => {
        const updated = prev.map((f) =>
          f.id === fileId ? { ...f, publicShareToken: token } : f
        );
        saveToStorage(updated);
        return updated;
      });
    }

    const host = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${host}/s/${file.id}?token=${token}`;

    logActivity(
      'public_link_generated',
      file.id,
      file.name,
      'Generated unrestricted public access URL.',
      file.sensitivity
    );

    return {
      success: true,
      url: shareUrl,
      message: 'Public link generated successfully.',
    };
  };

  const disablePublicLink = async (fileId: string) => {
    setFiles((prev) => {
      const updated = prev.map((f) =>
        f.id === fileId ? { ...f, publicShareToken: null } : f
      );
      saveToStorage(updated);
      return updated;
    });
  };

  // Folder Operations
  const createFolder = async (name: string, color: string = '#3B82F6'): Promise<Folder> => {
    const newFolder: Folder = {
      id: 'fld-' + Date.now(),
      name,
      ownerId: profile?.uid || 'usr-student-001',
      parentId: currentFolderId,
      color,
      fileCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setFolders((prev) => {
      const updated = [...prev, newFolder];
      saveToStorage(undefined, updated);
      return updated;
    });

    return newFolder;
  };

  const renameFolder = async (folderId: string, newName: string) => {
    setFolders((prev) => {
      const updated = prev.map((f) =>
        f.id === folderId ? { ...f, name: newName, updatedAt: new Date().toISOString() } : f
      );
      saveToStorage(undefined, updated);
      return updated;
    });
  };

  const deleteFolder = async (folderId: string) => {
    // Files inside folder move to root
    setFiles((prev) => {
      const updated = prev.map((f) => (f.folderId === folderId ? { ...f, folderId: null } : f));
      saveToStorage(updated);
      return updated;
    });

    setFolders((prev) => {
      const updated = prev.filter((f) => f.id !== folderId);
      saveToStorage(undefined, updated);
      return updated;
    });
  };

  // Derived Statistics
  const storageBreakdown: StorageBreakdown = React.useMemo(() => {
    let documents = 0;
    let images = 0;
    let videos = 0;
    let others = 0;

    files.forEach((f) => {
      if (f.category === 'document') documents += f.size;
      else if (f.category === 'image') images += f.size;
      else if (f.category === 'video') videos += f.size;
      else others += f.size;
    });

    const totalUsed = documents + images + videos + others;
    const quota = profile?.storageQuotaBytes || 5 * 1024 * 1024 * 1024;

    return { documents, images, videos, others, totalUsed, quota };
  }, [files, profile]);

  const sharedWithMeFiles = React.useMemo(() => {
    const userEmail = profile?.email.toLowerCase() || '';
    return files.filter(
      (f) =>
        f.ownerEmail.toLowerCase() !== userEmail &&
        (f.sharedWithEmails.some((e) => e.toLowerCase() === userEmail) || f.sensitivity === 'public')
    );
  }, [files, profile]);

  const recentFiles = React.useMemo(() => {
    return [...files].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ).slice(0, 5);
  }, [files]);

  const starredFiles = React.useMemo(() => {
    return files.filter((f) => f.isStarred);
  }, [files]);

  return (
    <VaultContext.Provider
      value={{
        files,
        folders,
        shares,
        activities,
        currentFolderId,
        setCurrentFolderId,
        searchQuery,
        setSearchQuery,
        sensitivityFilter,
        setSensitivityFilter,
        categoryFilter,
        setCategoryFilter,
        viewMode,
        setViewMode,
        uploadFile,
        deleteFile,
        renameFile,
        moveFile,
        toggleStar,
        downloadFile,
        shareFileWithUser,
        revokeShare,
        generatePublicLink,
        disablePublicLink,
        createFolder,
        renameFolder,
        deleteFolder,
        storageBreakdown,
        sharedWithMeFiles,
        recentFiles,
        starredFiles,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
}
