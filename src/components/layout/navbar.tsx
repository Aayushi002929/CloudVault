'use client';

import React, { useState } from 'react';
import {
  Search,
  Upload,
  Shield,
  LogOut,
  FolderPlus,
  User as UserIcon,
} from 'lucide-react';
import { useVault } from '@/context/vault-context';
import { useAuth } from '@/context/auth-context';
import { FileUploadModal } from '../files/file-upload-modal';
import { FolderModal } from '../files/folder-modal';
import { SensitivityLevel } from '@/types';

export function Navbar() {
  const { searchQuery, setSearchQuery, sensitivityFilter, setSensitivityFilter } = useVault();
  const { profile, logout, isDemoMode } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
        {/* Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files by name, type, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-3">
          {/* Sensitivity Filter Pills */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
            {(['all', 'public', 'private', 'confidential'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSensitivityFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  sensitivityFilter === lvl
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* New Folder Button */}
          <button
            onClick={() => setIsFolderOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition"
          >
            <FolderPlus className="w-4 h-4 text-slate-500" />
            <span>New Folder</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 shadow-sm shadow-blue-500/20 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-xs">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">
                  {profile?.name || 'Guest User'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-none truncate max-w-[140px]">
                  {profile?.email || 'not-authenticated'}
                </p>
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">{profile?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{profile?.email}</p>
                  {isDemoMode && (
                    <span className="inline-block mt-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-semibold px-2 py-0.5 rounded-full">
                      Academic Demo Mode
                    </span>
                  )}
                </div>

                <div className="px-2 py-1">
                  <a
                    href="/dashboard/profile"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>My Account & Quota</span>
                  </a>
                  <a
                    href="/dashboard/experiments"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50 rounded-lg"
                  >
                    <Shield className="w-4 h-4 text-indigo-500" />
                    <span>Viva Experiment Suite</span>
                  </a>
                </div>

                <div className="border-t border-slate-100 px-2 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modals */}
      <FileUploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <FolderModal isOpen={isFolderOpen} onClose={() => setIsFolderOpen(false)} />
    </>
  );
}
