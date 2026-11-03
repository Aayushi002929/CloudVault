import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FileCategory, SensitivityLevel } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  } catch {
    return 'Recently';
  }
}

export function getFileCategory(mimeType: string, filename: string): FileCategory {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (
    mimeType.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'].includes(ext)
  ) {
    return 'image';
  }
  if (
    mimeType.startsWith('video/') ||
    ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)
  ) {
    return 'video';
  }
  if (
    mimeType.startsWith('audio/') ||
    ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)
  ) {
    return 'audio';
  }
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('document') ||
    mimeType.includes('text') ||
    ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'csv', 'xlsx', 'pptx'].includes(ext)
  ) {
    return 'document';
  }
  if (
    mimeType.includes('zip') ||
    mimeType.includes('tar') ||
    ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)
  ) {
    return 'archive';
  }
  if (
    ['js', 'ts', 'tsx', 'jsx', 'json', 'py', 'java', 'c', 'cpp', 'html', 'css', 'sql'].includes(ext)
  ) {
    return 'code';
  }

  return 'other';
}

export function getSensitivityInfo(level: SensitivityLevel) {
  switch (level) {
    case 'public':
      return {
        label: 'Public',
        description: 'Shareable with anyone via public link or direct email.',
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotBg: 'bg-emerald-500',
        iconColor: 'text-emerald-600',
      };
    case 'private':
      return {
        label: 'Private',
        description: 'Strictly restricted to owner and explicitly authorized emails.',
        badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
        dotBg: 'bg-blue-500',
        iconColor: 'text-blue-600',
      };
    case 'confidential':
      return {
        label: 'Confidential',
        description: 'Highest security. Public links are blocked. Direct user grants only.',
        badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        dotBg: 'bg-rose-500',
        iconColor: 'text-rose-600',
      };
  }
}
