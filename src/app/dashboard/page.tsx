'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { StatCard } from '@/components/dashboard/stat-card';
import { StorageChart } from '@/components/dashboard/storage-chart';
import { RecentActivityList } from '@/components/dashboard/recent-activity-list';
import { FileTable } from '@/components/files/file-table';
import { useVault } from '@/context/vault-context';
import { formatBytes } from '@/lib/utils';
import {
  FileText,
  HardDrive,
  Users,
  ShieldCheck,
  Upload,
  ArrowRight,
  FolderPlus,
  Shield,
} from 'lucide-react';
import { FileUploadModal } from '@/components/files/file-upload-modal';
import { FolderModal } from '@/components/files/folder-modal';
import Link from 'next/link';

export default function DashboardPage() {
  const { files, storageBreakdown, shares, activities, recentFiles } = useVault();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);

  const publicFilesCount = files.filter((f) => f.sensitivity === 'public').length;
  const privateFilesCount = files.filter((f) => f.sensitivity === 'private').length;
  const confidentialFilesCount = files.filter((f) => f.sensitivity === 'confidential').length;

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Storage Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              CloudVault Security Prototype • Sensitivity-Based Access Control
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFolderOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>New Folder</span>
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Files"
            value={files.length}
            subtitle={`${formatBytes(storageBreakdown.totalUsed)} stored`}
            icon={FileText}
            iconBg="bg-blue-100/70"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Storage Used"
            value={formatBytes(storageBreakdown.totalUsed)}
            subtitle={`of ${formatBytes(storageBreakdown.quota)} capacity`}
            icon={HardDrive}
            iconBg="bg-indigo-100/70"
            iconColor="text-indigo-600"
          />
          <StatCard
            title="Active Shares"
            value={shares.length}
            subtitle="Direct user grants"
            icon={Users}
            iconBg="bg-emerald-100/70"
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Sensitivity Ratio"
            value={`${confidentialFilesCount} Conf`}
            subtitle={`${privateFilesCount} Priv • ${publicFilesCount} Pub`}
            icon={Shield}
            iconBg="bg-rose-100/70"
            iconColor="text-rose-600"
          />
        </div>

        {/* Charts & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StorageChart />
          </div>
          <div>
            <RecentActivityList activities={activities} limit={4} />
          </div>
        </div>

        {/* Recent Files Table Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Recent Files</h3>
              <p className="text-xs text-slate-500">Recently uploaded or updated items</p>
            </div>
            <Link
              href="/dashboard/files"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View all files</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <FileTable files={recentFiles} />
        </div>
      </div>

      {/* Modals */}
      <FileUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <FolderModal isOpen={isFolderOpen} onClose={() => setIsFolderOpen(false)} />
    </DashboardShell>
  );
}
