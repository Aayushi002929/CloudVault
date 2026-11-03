'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { FileTable } from '@/components/files/file-table';
import { useVault } from '@/context/vault-context';
import { Clock } from 'lucide-react';

export default function RecentFilesPage() {
  const { recentFiles } = useVault();

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recent Files</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Files accessed, uploaded, or modified in the last 7 days
          </p>
        </div>

        <FileTable files={recentFiles} />
      </div>
    </DashboardShell>
  );
}
