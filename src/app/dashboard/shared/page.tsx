'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { FileTable } from '@/components/files/file-table';
import { useVault } from '@/context/vault-context';
import { useAuth } from '@/context/auth-context';
import { Users, Shield, Share2, Trash2 } from 'lucide-react';
import { SensitivityBadge } from '@/components/security/sensitivity-badge';
import { formatDate } from '@/lib/utils';

export default function SharedPage() {
  const { sharedWithMeFiles, shares, revokeShare, files } = useVault();
  const { profile } = useAuth();

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shared Files</h1>
          <p className="text-xs text-slate-500 mt-1">
            Files shared with you or shared with other collaborators under controlled access
          </p>
        </div>

        {/* Section 1: Files Shared With Me */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Shared With Me</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {sharedWithMeFiles.length}
            </span>
          </div>
          <FileTable files={sharedWithMeFiles} />
        </div>

        {/* Section 2: Active Outgoing Shares Created By You */}
        <div className="space-y-3 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Outgoing Shares Active</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {shares.length} grants
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {shares.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                You have not shared any files with external users yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {shares.map((shr) => (
                  <div
                    key={shr.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{shr.fileName}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-slate-500">
                        <span>Recipient: <strong>{shr.sharedWith}</strong></span>
                        <span>•</span>
                        <span className="uppercase font-semibold text-blue-600">
                          {shr.permission} Permission
                        </span>
                        <span>•</span>
                        <span>Granted {formatDate(shr.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <SensitivityBadge level={shr.sensitivity} size="sm" />
                      <button
                        onClick={() => revokeShare(shr.id)}
                        className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke Access</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
