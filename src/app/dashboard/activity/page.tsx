'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useVault } from '@/context/vault-context';
import {
  Activity,
  Upload,
  Download,
  Share2,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  ShieldAlert,
  FolderInput,
} from 'lucide-react';
import { SensitivityBadge } from '@/components/security/sensitivity-badge';
import { formatDate } from '@/lib/utils';
import { ActivityAction } from '@/types';

export default function ActivityPage() {
  const { activities } = useVault();

  const getActionIcon = (action: ActivityAction) => {
    switch (action) {
      case 'file_uploaded':
        return <Upload className="w-4 h-4 text-blue-600" />;
      case 'file_downloaded':
        return <Download className="w-4 h-4 text-emerald-600" />;
      case 'file_shared':
        return <Share2 className="w-4 h-4 text-indigo-600" />;
      case 'file_deleted':
        return <Trash2 className="w-4 h-4 text-rose-600" />;
      case 'file_renamed':
        return <Edit2 className="w-4 h-4 text-amber-600" />;
      case 'access_granted':
        return <Unlock className="w-4 h-4 text-emerald-600" />;
      case 'access_revoked':
        return <Lock className="w-4 h-4 text-rose-600" />;
      case 'public_link_blocked':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'file_moved':
        return <FolderInput className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Activity History
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive immutable audit log of uploads, sharing actions, downloads, and access revocations
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No activity recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50/70 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {getActionIcon(act.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {act.fileName || 'Resource'}
                        </span>
                        {act.sensitivity && (
                          <SensitivityBadge level={act.sensitivity} size="sm" showIcon={false} />
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {formatDate(act.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.details}</p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>Initiated by: <strong>{act.userName}</strong> ({act.userEmail})</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {act.action}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
