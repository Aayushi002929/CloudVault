'use client';

import React, { useState, useRef } from 'react';
import { X, UploadCloud, File, ShieldCheck, Shield, ShieldAlert, Check } from 'lucide-react';
import { useVault } from '@/context/vault-context';
import { SensitivityLevel } from '@/types';
import { formatBytes } from '@/lib/utils';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const { uploadFile, folders, currentFolderId } = useVault();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folderId, setFolderId] = useState<string | null>(currentFolderId);
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('private');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setError('File exceeds max size limit of 25 MB');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setError('File exceeds max size limit of 25 MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please choose a file to upload');
      return;
    }

    setIsUploading(true);
    setProgress(25);

    try {
      // Simulate progress increments for responsive feel
      setTimeout(() => setProgress(65), 150);
      setTimeout(async () => {
        setProgress(100);
        await uploadFile(selectedFile, folderId, sensitivity);
        setIsUploading(false);
        setSelectedFile(null);
        setProgress(0);
        onClose();
      }, 350);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Upload File</h3>
            <p className="text-xs text-slate-500">
              Select file and configure Sensitivity-Based Access Control
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {error}
            </div>
          )}

          {/* File Drag & Drop Zone */}
          {!selectedFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition group"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-xl bg-blue-100/60 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Click to browse or drag and drop
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Supports PDF, DOCX, Images, Video, Code (Max: 25 MB)
              </p>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500">{formatBytes(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-xs text-rose-600 hover:underline shrink-0 ml-2"
              >
                Change
              </button>
            </div>
          )}

          {/* Folder Target Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Destination Folder
            </label>
            <select
              value={folderId || ''}
              onChange={(e) => setFolderId(e.target.value ? e.target.value : null)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">(Root directory / No folder)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sensitivity Classification Selection (Research Core Feature) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                File Sensitivity Classification
              </label>
              <span className="text-[11px] text-blue-600 font-medium">Research Policy</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Public */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  sensitivity === 'public'
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="sensitivity"
                  value="public"
                  checked={sensitivity === 'public'}
                  onChange={() => setSensitivity('public')}
                  className="mt-1"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Public</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Can be shared openly using a public link. Anyone with the URL can view/download.
                  </p>
                </div>
              </label>

              {/* Option 2: Private */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  sensitivity === 'private'
                    ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="sensitivity"
                  value="private"
                  checked={sensitivity === 'private'}
                  onChange={() => setSensitivity('private')}
                  className="mt-1"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Private</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Only the owner and explicitly authorized user emails can access. Public links are disabled.
                  </p>
                </div>
              </label>

              {/* Option 3: Confidential */}
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  sensitivity === 'confidential'
                    ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="sensitivity"
                  value="confidential"
                  checked={sensitivity === 'confidential'}
                  onChange={() => setSensitivity('confidential')}
                  className="mt-1"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Confidential (Highest Security)</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    Restricted strictly to owner and designated registered users. Public sharing is strictly blocked.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Uploading and encrypting metadata...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition"
            >
              {isUploading ? 'Uploading...' : 'Confirm Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
