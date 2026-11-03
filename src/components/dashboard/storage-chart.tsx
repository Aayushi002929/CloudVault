'use client';

import React from 'react';
import { useVault } from '@/context/vault-context';
import { formatBytes } from '@/lib/utils';
import { FileText, Image, Video, FileQuestion, HardDrive } from 'lucide-react';

export function StorageChart() {
  const { storageBreakdown } = useVault();
  const { documents, images, videos, others, totalUsed, quota } = storageBreakdown;

  const docPercent = quota > 0 ? (documents / quota) * 100 : 0;
  const imgPercent = quota > 0 ? (images / quota) * 100 : 0;
  const vidPercent = quota > 0 ? (videos / quota) * 100 : 0;
  const othPercent = quota > 0 ? (others / quota) * 100 : 0;
  const totalPercent = Math.min(100, Math.round((totalUsed / quota) * 100));

  const items = [
    {
      name: 'Documents',
      size: documents,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      icon: FileText,
    },
    {
      name: 'Images',
      size: images,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      icon: Image,
    },
    {
      name: 'Videos',
      size: videos,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      icon: Video,
    },
    {
      name: 'Other Files',
      size: others,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      icon: FileQuestion,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Storage Distribution</h4>
          <p className="text-xs text-slate-500">Breakdown by file category</p>
        </div>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
          {totalPercent}% of {formatBytes(quota)}
        </span>
      </div>

      {/* Progress segmented bar */}
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex mb-6">
        <div
          style={{ width: `${docPercent}%` }}
          className="bg-blue-500 h-full transition-all duration-500"
          title={`Documents: ${formatBytes(documents)}`}
        />
        <div
          style={{ width: `${imgPercent}%` }}
          className="bg-emerald-500 h-full transition-all duration-500"
          title={`Images: ${formatBytes(images)}`}
        />
        <div
          style={{ width: `${vidPercent}%` }}
          className="bg-purple-500 h-full transition-all duration-500"
          title={`Videos: ${formatBytes(videos)}`}
        />
        <div
          style={{ width: `${othPercent}%` }}
          className="bg-amber-500 h-full transition-all duration-500"
          title={`Other: ${formatBytes(others)}`}
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-3"
            >
              <div
                className={`w-8 h-8 rounded-lg ${item.color}/10 ${item.textColor} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-medium text-slate-700 block truncate">
                  {item.name}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {formatBytes(item.size)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
