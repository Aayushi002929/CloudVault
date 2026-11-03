'use client';

import React from 'react';
import { X, Download, FileText, Calendar, HardDrive, User, Shield } from 'lucide-react';
import { CloudFile } from '@/types';
import { formatBytes, formatDate } from '@/lib/utils';
import { SensitivityBadge } from '../security/sensitivity-badge';
import { useVault } from '@/context/vault-context';

interface FilePreviewModalProps {
  file: CloudFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FilePreviewModal({ file, isOpen, onClose }: FilePreviewModalProps) {
  const { downloadFile } = useVault();

  if (!isOpen || !file) return null;

  const isImage = file.category === 'image';
  const isVideo = file.category === 'video';
  const isPdf = file.type.includes('pdf');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-slate-900 truncate max-w-md">
                {file.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <SensitivityBadge level={file.sensitivity} size="sm" />
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadFile(file)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-slate-100/60 min-h-[350px]">
          {isImage ? (
            <img
              src={file.downloadUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200'}
              alt={file.name}
              className="max-h-[500px] max-w-full rounded-xl object-contain shadow-md"
            />
          ) : isVideo ? (
            <video
              controls
              src={file.downloadUrl || ''}
              className="max-h-[480px] max-w-full rounded-xl shadow-md"
            >
              Your browser does not support HTML5 video preview.
            </video>
          ) : isPdf ? (
            <div className="w-full h-[500px] bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              <FileText className="w-16 h-16 text-rose-500 mb-3" />
              <h4 className="font-semibold text-slate-800 text-sm">{file.name}</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Embedded PDF document ready for reading. Click download to view complete multi-page manuscript.
              </p>
              <button
                onClick={() => downloadFile(file)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open / Download PDF</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 max-w-md shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">{file.name}</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Direct browser rendering is not supported for this file type ({file.type}). You can securely download the file to inspect its full contents.
              </p>
              <button
                onClick={() => downloadFile(file)}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Download {formatBytes(file.size)}</span>
              </button>
            </div>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="p-4 px-6 border-t border-slate-200 bg-white grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Owner</span>
              <span className="font-medium text-slate-800 truncate block max-w-[120px]">
                {file.ownerName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Size</span>
              <span className="font-medium text-slate-800">{formatBytes(file.size)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Uploaded</span>
              <span className="font-medium text-slate-800">{formatDate(file.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Sensitivity Tier</span>
              <span className="font-medium text-slate-800 capitalize">{file.sensitivity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
