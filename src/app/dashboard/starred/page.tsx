'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { FileTable } from '@/components/files/file-table';
import { useVault } from '@/context/vault-context';
import { Star } from 'lucide-react';

export default function StarredFilesPage() {
  const { starredFiles } = useVault();

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Starred Files
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Important bookmarked files for quick academic access
          </p>
        </div>

        <FileTable files={starredFiles} />
      </div>
    </DashboardShell>
  );
}
