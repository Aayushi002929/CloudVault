import React from 'react';
import { SensitivityLevel } from '@/types';
import { getSensitivityInfo } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

interface SensitivityBadgeProps {
  level: SensitivityLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function SensitivityBadge({
  level,
  size = 'md',
  showIcon = true,
}: SensitivityBadgeProps) {
  const info = getSensitivityInfo(level);

  const getIcon = () => {
    switch (level) {
      case 'public':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'private':
        return <Shield className="w-3.5 h-3.5" />;
      case 'confidential':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-wider transition-all ${info.badgeBg} ${sizeClasses[size]}`}
      title={info.description}
    >
      {showIcon && getIcon()}
      <span>{info.label}</span>
    </span>
  );
}
