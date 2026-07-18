import * as React from 'react';
import { cn } from '../lib/utils';
import { CheckCircle2, AlertTriangle, Clock, XCircle } from 'lucide-react';

export type SyncStatus = 'synced' | 'behind' | 'reviewing' | 'failed';

interface StatusChipProps extends React.HTMLAttributes<HTMLDivElement> {
  status: SyncStatus;
}

export function StatusChip({ status, className, ...props }: StatusChipProps) {
  const config = {
    synced: {
      label: 'Synced',
      icon: CheckCircle2,
      classes: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20',
    },
    behind: {
      label: 'Behind Main',
      icon: AlertTriangle,
      classes: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20',
    },
    reviewing: {
      label: 'Reviewing',
      icon: Clock,
      classes: 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20',
    },
    failed: {
      label: 'Failed',
      icon: XCircle,
      classes: 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-400/10 border-red-200 dark:border-red-400/20',
    }
  };

  const { label, icon: Icon, classes } = config[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        classes,
        className
      )}
      {...props}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}
