'use client';

import React, { useState } from 'react';
import {
  FileText,
  Image,
  Video,
  FileCode,
  FileArchive,
  File,
  Star,
  Download,
  Share2,
  Trash2,
  Edit2,
  FolderInput,
  Eye,
  MoreVertical,
} from 'lucide-react';
import { CloudFile } from '@/types';
import { formatBytes, formatDate } from '@/lib/utils';
import { SensitivityBadge } from '../security/sensitivity-badge';
import { useVault } from '@/context/vault-context';
import { FilePreviewModal } from './file-preview-modal';
import { FileShareModal } from './file-share-modal';
import { MoveFileModal } from './move-file-modal';

interface FileTableProps {
  files: CloudFile[];
}

export function FileTable({ files }: FileTableProps) {
  const { toggleStar, deleteFile, renameFile, downloadFile, folders } = useVault();
  const [previewFile, setPreviewFile] = useState<CloudFile | null>(null);
  const [shareFile, setShareFile] = useState<CloudFile | null>(null);
  const [moveFile, setMoveFile] = useState<CloudFile | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getFileIcon = (file: CloudFile) => {
    switch (file.category) {
      case 'image':
        return <Image className="w-4 h-4 text-emerald-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-purple-500" />;
      case 'code':
        return <FileCode className="w-4 h-4 text-amber-500" />;
      case 'archive':
        return <FileArchive className="w-4 h-4 text-rose-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <File className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleRename = (file: CloudFile) => {
    const newName = prompt('Enter new filename:', file.name);
    if (newName && newName.trim() && newName !== file.name) {
      renameFile(file.id, newName.trim());
    }
    setActiveDropdown(null);
  };

  const handleDelete = (file: CloudFile) => {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      deleteFile(file.id);
    }
    setActiveDropdown(null);
  };

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <File className="w-8 h-8" />
        </div>
        <h4 className="font-semibold text-slate-900 text-sm">No files found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No files match your current filter, folder, or search query. Click "Upload File" above to add new files.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 pl-6 pr-3 w-10"></th>
                <th className="py-3.5 px-3">Name</th>
                <th className="py-3.5 px-3 hidden sm:table-cell">Type</th>
                <th className="py-3.5 px-3">Size</th>
                <th className="py-3.5 px-3">Sensitivity</th>
                <th className="py-3.5 px-3 hidden md:table-cell">Folder</th>
                <th className="py-3.5 px-3 hidden lg:table-cell">Modified</th>
                <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {files.map((file) => {
                const folder = folders.find((f) => f.id === file.folderId);

                return (
                  <tr
                    key={file.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Star Column */}
                    <td className="py-3.5 pl-6 pr-2">
                      <button
                        onClick={() => toggleStar(file.id)}
                        className={`transition ${
                          file.isStarred
                            ? 'text-amber-400 hover:text-amber-500'
                            : 'text-slate-200 group-hover:text-slate-400 hover:text-amber-400'
                        }`}
                        title={file.isStarred ? 'Unstar' : 'Star'}
                      >
                        <Star
                          className="w-4 h-4"
                          fill={file.isStarred ? 'currentColor' : 'none'}
                        />
                      </button>
                    </td>

                    {/* File Name & Icon */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          {getFileIcon(file)}
                        </div>
                        <div className="min-w-0 max-w-xs md:max-w-sm">
                          <button
                            onClick={() => setPreviewFile(file)}
                            className="font-medium text-slate-900 hover:text-blue-600 transition truncate block text-left"
                            title={file.name}
                          >
                            {file.name}
                          </button>
                          {file.sharedWithEmails.length > 0 && (
                            <span className="text-[10px] text-blue-600 font-medium">
                              Shared with {file.sharedWithEmails.length} user(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-3 hidden sm:table-cell text-slate-500 uppercase font-medium">
                      {file.category}
                    </td>

                    {/* Size */}
                    <td className="py-3.5 px-3 text-slate-600 font-mono">
                      {formatBytes(file.size)}
                    </td>

                    {/* Sensitivity */}
                    <td className="py-3.5 px-3">
                      <SensitivityBadge level={file.sensitivity} size="sm" />
                    </td>

                    {/* Folder */}
                    <td className="py-3.5 px-3 hidden md:table-cell text-slate-500">
                      {folder ? (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          📁 {folder.name}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Modified */}
                    <td className="py-3.5 px-3 hidden lg:table-cell text-slate-500">
                      {formatDate(file.updatedAt)}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 pr-6 pl-3 text-right">
                      <div className="flex items-center justify-end gap-1 relative">
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadFile(file)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShareFile(file)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        {/* More Options Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveDropdown(activeDropdown === file.id ? null : file.id)
                            }
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeDropdown === file.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-left">
                              <button
                                onClick={() => {
                                  setPreviewFile(file);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() => {
                                  downloadFile(file);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                              >
                                <Download className="w-3.5 h-3.5 text-slate-400" />
                                <span>Download</span>
                              </button>
                              <button
                                onClick={() => {
                                  setShareFile(file);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                              >
                                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Share & Access</span>
                              </button>
                              <button
                                onClick={() => {
                                  setMoveFile(file);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                              >
                                <FolderInput className="w-3.5 h-3.5 text-slate-400" />
                                <span>Move to Folder</span>
                              </button>
                              <button
                                onClick={() => handleRename(file)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Rename</span>
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button
                                onClick={() => handleDelete(file)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <FilePreviewModal
        file={previewFile}
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
      />
      <FileShareModal
        file={shareFile}
        isOpen={Boolean(shareFile)}
        onClose={() => setShareFile(null)}
      />
      <MoveFileModal
        file={moveFile}
        isOpen={Boolean(moveFile)}
        onClose={() => setMoveFile(null)}
      />
    </>
  );
}
