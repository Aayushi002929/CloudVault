'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { useAuth } from '@/context/auth-context';
import { useVault } from '@/context/vault-context';
import { formatBytes } from '@/lib/utils';
import {
  User,
  Mail,
  HardDrive,
  Calendar,
  ShieldCheck,
  LogOut,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, logout, isDemoMode } = useAuth();
  const { storageBreakdown, files } = useVault();

  const usedPercent = Math.min(
    100,
    Math.round((storageBreakdown.totalUsed / storageBreakdown.quota) * 100)
  );

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your account credentials, storage allocation, and authentication state
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-blue-500/20">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-slate-900">{profile?.name}</h3>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Verified User
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile?.email}</span>
              </p>
              {isDemoMode && (
                <span className="inline-block mt-2 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                  Academic Demo Mode Active
                </span>
              )}
            </div>

            <button
              onClick={() => logout()}
              className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Quota & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Storage Quota Card */}
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-blue-600" />
                  <span>Storage Allocation</span>
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {formatBytes(storageBreakdown.totalUsed)} / {formatBytes(storageBreakdown.quota)}
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{usedPercent}% capacity consumed</span>
                <span>{files.length} Total Files</span>
              </div>
            </div>

            {/* Security Status Card */}
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2.5">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Security & Authorization</span>
              </span>

              <ul className="text-xs space-y-2 text-slate-600 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Firebase Authentication: Active</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sensitivity Access Enforcement: Strict</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Audit Logging: Enabled</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
