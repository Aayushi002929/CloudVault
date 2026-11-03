'use client';

import React, { useState } from 'react';
import { X, FolderInput, Folder } from 'lucide-react';
import { CloudFile } from '@/types';
import { useVault } from '@/context/vault-context';

interface MoveFileModalProps {
  file: CloudFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MoveFileModal({ file, isOpen, onClose }: MoveFileModalProps) {
  const { folders, moveFile } = useVault();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(file?.folderId || null);

  if (!isOpen || !file) return null;

  const handleMove = async () => {
    await moveFile(file.id, selectedFolderId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderInput className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Move File</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600 truncate">
            Moving: <span className="font-semibold text-slate-900">{file.name}</span>
          </p>

          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {/* Root Option */}
            <button
              onClick={() => setSelectedFolderId(null)}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs text-left transition ${
                selectedFolderId === null
                  ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Folder className="w-4 h-4 text-slate-400" />
              <span>(Root / My Files)</span>
            </button>

            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFolderId(f.id)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs text-left transition ${
                  selectedFolderId === f.id
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-sm shrink-0"
                  style={{ backgroundColor: f.color || '#3B82F6' }}
                />
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleMove}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
          >
            Move Here
          </button>
        </div>
      </div>
    </div>
  );
}
