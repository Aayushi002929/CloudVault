'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { FileTable } from '@/components/files/file-table';
import { useVault } from '@/context/vault-context';
import { Upload, FolderPlus, Filter, X } from 'lucide-react';
import { FileUploadModal } from '@/components/files/file-upload-modal';
import { FolderModal } from '@/components/files/folder-modal';
import { SensitivityLevel } from '@/types';

export default function MyFilesPage() {
  const {
    files,
    folders,
    currentFolderId,
    setCurrentFolderId,
    searchQuery,
    sensitivityFilter,
    setSensitivityFilter,
  } = useVault();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  // Filter files by folder, sensitivity, and search query
  const filteredFiles = files.filter((f) => {
    // Folder filter
    if (currentFolderId && f.folderId !== currentFolderId) return false;

    // Sensitivity filter
    if (sensitivityFilter !== 'all' && f.sensitivity !== sensitivityFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = f.name.toLowerCase().includes(q);
      const matchesOwner = f.ownerName.toLowerCase().includes(q);
      const matchesCategory = f.category.toLowerCase().includes(q);
      return matchesName || matchesOwner || matchesCategory;
    }

    return true;
  });

  const activeFolder = folders.find((f) => f.id === currentFolderId);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeFolder ? `📁 ${activeFolder.name}` : 'My Files'}
              </h1>
              {activeFolder && (
                <button
                  onClick={() => setCurrentFolderId(null)}
                  className="text-xs text-blue-600 hover:underline ml-2"
                >
                  (Back to Root)
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredFiles.length} file(s) across all folders
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFolderOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>New Folder</span>
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
          </div>
        </div>

        {/* Filters and Breadcrumb Bar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sensitivity Filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Sensitivity:
            </span>
            {(['all', 'public', 'private', 'confidential'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSensitivityFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg capitalize transition font-medium ${
                  sensitivityFilter === lvl
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Folder Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-400 font-semibold uppercase text-[10px] mr-1">
              Folders:
            </span>
            <button
              onClick={() => setCurrentFolderId(null)}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                currentFolderId === null
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Files
            </button>
            {folders.map((fld) => (
              <button
                key={fld.id}
                onClick={() => setCurrentFolderId(fld.id)}
                className={`px-2.5 py-1 rounded-lg transition font-medium flex items-center gap-1 ${
                  currentFolderId === fld.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>📁 {fld.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Files Table */}
        <FileTable files={filteredFiles} />
      </div>

      <FileUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <FolderModal isOpen={isFolderOpen} onClose={() => setIsFolderOpen(false)} />
    </DashboardShell>
  );
}
