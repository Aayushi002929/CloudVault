'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useVault } from '@/context/vault-context';
import { FolderModal } from '@/components/files/folder-modal';
import { FileTable } from '@/components/files/file-table';
import { Folder, FolderPlus, Trash2, Edit2, ArrowRight } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export default function FoldersPage() {
  const { folders, files, deleteFolder, renameFolder, currentFolderId, setCurrentFolderId } =
    useVault();
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  const handleRename = (folderId: string, currentName: string) => {
    const newName = prompt('Enter new folder name:', currentName);
    if (newName && newName.trim() && newName !== currentName) {
      renameFolder(folderId, newName.trim());
    }
  };

  const handleDelete = (folderId: string, folderName: string) => {
    if (
      confirm(
        `Are you sure you want to delete folder "${folderName}"? Files inside will be moved to root.`
      )
    ) {
      deleteFolder(folderId);
      if (currentFolderId === folderId) setCurrentFolderId(null);
    }
  };

  const selectedFolder = folders.find((f) => f.id === currentFolderId);
  const filesInFolder = selectedFolder
    ? files.filter((f) => f.folderId === selectedFolder.id)
    : [];

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Folders</h1>
            <p className="text-xs text-slate-500 mt-1">
              Organize your research documents and datasets into structured directories
            </p>
          </div>

          <button
            onClick={() => setIsFolderOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Create Folder</span>
          </button>
        </div>

        {/* Folders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {folders.map((fld) => {
            const count = files.filter((f) => f.folderId === fld.id).length;
            const size = files
              .filter((f) => f.folderId === fld.id)
              .reduce((acc, f) => acc + f.size, 0);
            const isSelected = currentFolderId === fld.id;

            return (
              <div
                key={fld.id}
                onClick={() => setCurrentFolderId(isSelected ? null : fld.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: fld.color || '#3B82F6' }}
                  >
                    <Folder className="w-5 h-5" />
                  </div>
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleRename(fld.id, fld.name)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                      title="Rename folder"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(fld.id, fld.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete folder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{fld.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span>{count} file(s)</span>
                    <span>{formatBytes(size)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Folder Contents */}
        {selectedFolder && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Files in "{selectedFolder.name}"
                </h3>
                <p className="text-xs text-slate-500">
                  Showing all files assigned to this folder
                </p>
              </div>
              <button
                onClick={() => setCurrentFolderId(null)}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear Selection
              </button>
            </div>

            <FileTable files={filesInFolder} />
          </div>
        )}
      </div>

      <FolderModal isOpen={isFolderOpen} onClose={() => setIsFolderOpen(false)} />
    </DashboardShell>
  );
}
