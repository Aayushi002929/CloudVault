'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useVault } from '@/context/vault-context';
import { evaluateFileAccess } from '@/lib/sensitivity';
import { formatBytes, formatDate } from '@/lib/utils';
import { SensitivityBadge } from '@/components/security/sensitivity-badge';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  FileText,
  Lock,
  ArrowLeft,
  Calendar,
  HardDrive,
  User,
  ExternalLink,
} from 'lucide-react';

export default function PublicSharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { files, downloadFile } = useVault();

  // Find file by fileId or publicShareToken
  const file = files.find(
    (f) => f.id === resolvedParams.shareId || f.publicShareToken === resolvedParams.shareId
  );

  if (!file) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">File Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            The link you followed may be invalid, revoked, or expired.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go to CloudVault Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Evaluate access strictly using the SBAC engine
  const accessResult = evaluateFileAccess({
    file,
    user: null,
    isPublicLinkRequest: true,
    publicToken: token || file.publicShareToken,
  });

  // SCENARIO 1: Access Denied (Private / Confidential or Tampering)
  if (!accessResult.allowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-rose-200 p-8 max-w-lg w-full text-center shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            Security Policy Violation
          </span>

          <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
            Access Denied (403 Forbidden)
          </h2>

          <p className="text-xs text-slate-600 mt-3 leading-relaxed text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
            {accessResult.reason}
          </p>

          <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-left text-[11px] text-rose-800 space-y-1">
            <p><strong>Attempted Resource:</strong> {file.name}</p>
            <p><strong>Sensitivity Tier:</strong> {file.sensitivity.toUpperCase()}</p>
            <p><strong>Policy Enforced:</strong> SBAC_RULE_PUBLIC_LINK_RESTRICTION</p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Sign In with Authorized Account
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // SCENARIO 2: Access Granted (Public File)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-lg text-slate-900 tracking-tight">
            CloudVault
          </Link>
          <span className="text-xs text-slate-400">• Public File Gateway</span>
        </div>
        <Link
          href="/login"
          className="text-xs text-blue-600 font-semibold hover:underline"
        >
          Sign In to Your Vault
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden w-full max-w-2xl">
          {/* Card Header */}
          <div className="p-6 border-b border-slate-100 bg-emerald-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-900 truncate max-w-md">
                  {file.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <SensitivityBadge level="public" size="sm" />
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{formatBytes(file.size)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => downloadFile(file)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>

          {/* Visual Preview */}
          <div className="p-6 bg-slate-100/60 min-h-[280px] flex items-center justify-center">
            {file.category === 'image' ? (
              <img
                src={file.downloadUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200'}
                alt={file.name}
                className="max-h-[380px] rounded-xl object-contain shadow-md"
              />
            ) : file.category === 'video' ? (
              <video controls src={file.downloadUrl || ''} className="max-h-[380px] rounded-xl shadow-md">
                HTML5 Video Preview
              </video>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 max-w-sm">
                <FileText className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">{file.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Public document shared via CloudVault. Ready for immediate download.
                </p>
                <button
                  onClick={() => downloadFile(file)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
                >
                  Download {formatBytes(file.size)}
                </button>
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="p-6 bg-white grid grid-cols-3 gap-4 text-xs text-slate-600 border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Shared by</span>
              <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                {file.ownerName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Created</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {formatDate(file.createdAt)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Status</span>
              <span className="font-semibold text-emerald-600 mt-0.5 block">
                Public Link Verified
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
