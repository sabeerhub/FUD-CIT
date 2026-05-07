'use client';

import { cn } from '@/utils/cn';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export function PremiumTable({ headers, children, className }: TableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">
            {headers.map((header) => (
              <th key={header} className="px-6 py-4 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
          {children}
        </tbody>
      </table>
    </div>
  );
}
