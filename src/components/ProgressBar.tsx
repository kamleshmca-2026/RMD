'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percent: number
  className?: string
  showLabel?: boolean
}

export default function ProgressBar({ percent, className, showLabel = false }: ProgressBarProps) {
  const clampedPercent = Math.min(Math.max(percent, 0), 100)

  return (
    <div className="flex items-center gap-2">
      <div className={cn('progress-bar w-full', className)}>
        <div
          className="progress-fill"
          style={{ width: `${clampedPercent}%` }}
          role="progressbar"
          aria-valuenow={clampedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 w-12 text-right">
          {Math.round(clampedPercent)}%
        </span>
      )}
    </div>
  )
}
