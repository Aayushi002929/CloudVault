'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Mail,
  Lock,
} from 'lucide-react';
import { useVault } from '@/context/vault-context';
import { CloudFile, SharePermission } from '@/types';
import { SensitivityBadge } from '../security/sensitivity-badge';

interface FileShareModalProps {
  file: CloudFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FileShareModal({ file, isOpen, onClose }: FileShareModalProps) {
  const { shareFileWithUser, revokeShare, shares, generatePublicLink } = useVault();
  const [activeTab, setActiveTab] = useState<'users' | 'public'>('users');
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<SharePermission>('view');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen || !file) return null;

  const fileShares = shares.filter((s) => s.fileId === file.id);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const res = await shareFileWithUser(file.id, email, permission);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setEmail('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handlePublicLink = () => {
    const res = generatePublicLink(file.id);
    if (res.success && res.url) {
      navigator.clipboard.writeText(res.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      setFeedback({ type: 'success', message: 'Public link copied to clipboard!' });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 truncate max-w-[280px]">
                Share "{file.name}"
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500">Access Level:</span>
                <SensitivityBadge level={file.sensitivity} size="sm" />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-5">
          <button
            onClick={() => {
              setActiveTab('users');
              setFeedback(null);
            }}
            className={`py-3 text-xs font-semibold border-b-2 mr-6 transition ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Direct User Access ({file.sharedWithEmails.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('public');
              setFeedback(null);
            }}
            className={`py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'public'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Public Share Link
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {feedback && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {activeTab === 'users' ? (
            <>
              {/* Add User Form */}
              <form onSubmit={handleShare} className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  Grant Access to Registered Email
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="e.g. professor@btech.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={permission}
                    onChange={(e) => setPermission(e.target.value as SharePermission)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="view">View Only</option>
                    <option value="download">Download</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition shrink-0"
                  >
                    Grant
                  </button>
                </div>
              </form>

              {/* Shared Users List */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-700 block mb-2">
                  Authorized Users
                </span>
                {fileShares.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <UserCheck className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs text-slate-500">
                      No external users authorized yet. File is private to owner.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {fileShares.map((shr) => (
                      <div
                        key={shr.id}
                        className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/80 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-medium text-slate-900">{shr.sharedWith}</p>
                          <span className="text-[10px] text-slate-500 uppercase font-semibold">
                            {shr.permission} Permission
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => revokeShare(shr.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Public Share Link Tab */
            <div className="space-y-4 py-2">
              {file.sensitivity === 'public' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Public Sharing Permitted</p>
                      <p className="text-emerald-700 mt-0.5">
                        This file is classified as <strong>Public</strong>. Anyone with the link
                        can view and download it.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePublicLink}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Link Copied!' : 'Generate & Copy Public Link'}</span>
                  </button>
                </div>
              ) : (
                /* Blocked Public Link View (The Research Contribution) */
                <div className="space-y-3">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wide">
                      <Lock className="w-4 h-4 text-rose-600" />
                      <span>Sensitivity Policy Enforcement</span>
                    </div>
                    <p className="text-xs text-rose-700 leading-relaxed">
                      Public links are <strong>strictly disabled</strong> for{' '}
                      <span className="font-semibold uppercase">{file.sensitivity}</span> files to
                      prevent accidental data leakage.
                    </p>
                    <div className="text-[11px] text-rose-600 bg-rose-100/60 p-2 rounded-lg font-mono">
                      Rule: SBAC_RULE_PUBLIC_LINK_RESTRICTION (Status: BLOCKED)
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 text-center">
                    To securely share this file, switch to the <strong>Direct User Access</strong>{' '}
                    tab and authorize specific user emails.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
