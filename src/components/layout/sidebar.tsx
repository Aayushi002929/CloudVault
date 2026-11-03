'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Folder,
  HardDrive,
  Clock,
  Star,
  Activity,
  User,
  Users,
  FlaskConical,
  Cloud,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useVault } from '@/context/vault-context';
import { useAuth } from '@/context/auth-context';
import { formatBytes } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { storageBreakdown, files } = useVault();
  const { profile, switchDemoUser } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: HardDrive },
    { label: 'My Files', href: '/dashboard/files', icon: Folder, badge: files.length },
    { label: 'Folders', href: '/dashboard/folders', icon: Database },
    { label: 'Shared With Me', href: '/dashboard/shared', icon: Users },
    { label: 'Recent Files', href: '/dashboard/recent', icon: Clock },
    { label: 'Starred', href: '/dashboard/starred', icon: Star },
    { label: 'Activity', href: '/dashboard/activity', icon: Activity },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    {
      label: 'Research & Viva Lab',
      href: '/dashboard/experiments',
      icon: FlaskConical,
      highlight: true,
    },
  ];

  const usedPercent = Math.min(
    100,
    Math.round((storageBreakdown.totalUsed / storageBreakdown.quota) * 100)
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">CloudVault</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">B.Tech Security Prototype</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Storage & Sharing
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                  : item.highlight
                  ? 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-blue-600'
                      : item.highlight
                      ? 'text-indigo-600'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {item.badge}
                </span>
              )}
              {item.highlight && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white uppercase">
                  Tests
                </span>
              )}
            </Link>
          );
        })}

        {/* Viva Quick Switcher */}
        <div className="pt-4 mt-4 border-t border-slate-100 px-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Viva Evaluator Role
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              onClick={() => switchDemoUser('student')}
              className={`px-2 py-1.5 rounded-lg border text-left transition ${
                profile?.uid === 'usr-student-001'
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              🎓 Student
            </button>
            <button
              onClick={() => switchDemoUser('professor')}
              className={`px-2 py-1.5 rounded-lg border text-left transition ${
                profile?.uid === 'usr-prof-002'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              👨‍🏫 Guide
            </button>
          </div>
          <button
            onClick={() => switchDemoUser('unauthorized')}
            className={`w-full mt-1.5 px-2 py-1.5 rounded-lg border text-xs text-left transition ${
              profile?.uid === 'usr-external-999'
                ? 'bg-rose-50 border-rose-300 text-rose-700 font-medium'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            🕵️ Unauthorized Attacker
          </button>
        </div>
      </div>

      {/* Storage Indicator */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-700">
          <span>Storage</span>
          <span className="text-slate-500">
            {formatBytes(storageBreakdown.totalUsed)} / {formatBytes(storageBreakdown.quota)}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500">
          <span>{usedPercent}% capacity used</span>
          <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center">
            Details <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
