'use client';

import React from 'react';
import {
  Upload,
  Download,
  Share2,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  FolderInput,
  ShieldAlert,
} from 'lucide-react';
import { ActivityAction, ActivityLog } from '@/types';
import { formatDate } from '@/lib/utils';
import { SensitivityBadge } from '../security/sensitivity-badge';

interface RecentActivityListProps {
  activities: ActivityLog[];
  limit?: number;
}

export function RecentActivityList({ activities, limit = 5 }: RecentActivityListProps) {
  const displayed = activities.slice(0, limit);

  const getActionIcon = (action: ActivityAction) => {
    switch (action) {
      case 'file_uploaded':
        return <Upload className="w-3.5 h-3.5 text-blue-600" />;
      case 'file_downloaded':
        return <Download className="w-3.5 h-3.5 text-emerald-600" />;
      case 'file_shared':
        return <Share2 className="w-3.5 h-3.5 text-indigo-600" />;
      case 'file_deleted':
        return <Trash2 className="w-3.5 h-3.5 text-rose-600" />;
      case 'file_renamed':
        return <Edit2 className="w-3.5 h-3.5 text-amber-600" />;
      case 'access_granted':
        return <Unlock className="w-3.5 h-3.5 text-emerald-600" />;
      case 'access_revoked':
        return <Lock className="w-3.5 h-3.5 text-rose-600" />;
      case 'public_link_blocked':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      case 'file_moved':
        return <FolderInput className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Share2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
        No activities recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Security Audit & Activity History</h4>
          <p className="text-xs text-slate-500">Live immutable action trail</p>
        </div>
        <a
          href="/dashboard/activity"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          View all
        </a>
      </div>

      <div className="space-y-4">
        {displayed.map((act) => (
          <div key={act.id} className="flex items-start gap-3 text-xs">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              {getActionIcon(act.action)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800 truncate">
                  {act.fileName || 'Vault Resource'}
                </span>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {formatDate(act.timestamp)}
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                {act.details}
              </p>
              {act.sensitivity && (
                <div className="mt-1">
                  <SensitivityBadge level={act.sensitivity} size="sm" showIcon={false} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
