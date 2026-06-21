'use client'

import { Release } from '@/types'
import { formatDate, formatPercent } from '@/lib/formatting'
import { ExternalLink, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import IssueTable from '../IssueTable'
import TeamAvatars from '../TeamAvatars'
import ProgressBar from '../ProgressBar'

interface ReleaseViewProps {
  release: Release
}

export default function ReleaseView({ release }: ReleaseViewProps) {
  const { milestone, issues, scopePercent, criticalIssues, assignedTeam, status } = release

  const statusColors = {
    active: 'bg-blue-50 border-blue-200',
    historical: 'bg-green-50 border-green-200',
    planned: 'bg-slate-50 border-slate-200',
  }

  const statusIcons = {
    active: <Clock className="w-5 h-5 text-blue-600" />,
    historical: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    planned: <Clock className="w-5 h-5 text-slate-600" />,
  }

  const statusLabels = {
    active: 'Active',
    historical: 'Historical',
    planned: 'Planned',
  }

  return (
    <div className={`card border ${statusColors[status]}`}>
      {/* Header */}
      <div className="card-header flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {statusIcons[status]}
            <h2 className="text-2xl font-semibold tracking-tight">{milestone.title}</h2>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-xs font-medium bg-white border border-slate-200">
              {statusLabels[status]}
            </span>
          </div>
          {milestone.description && (
            <p className="text-slate-600 text-sm mt-2">{milestone.description}</p>
          )}
        </div>
        <a
          href={milestone.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-600 transition-colors ml-4"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>

      {/* Metrics Bar */}
      <div className="card-body bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Due Date */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Due Date</p>
            <p className="text-base font-medium text-slate-900">
              {formatDate(milestone.dueDate)}
            </p>
          </div>

          {/* Issues Count */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Issues</p>
            <p className="text-base font-medium text-slate-900">{issues.length}</p>
          </div>

          {/* Scope Completion */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Scope</p>
            <p className="text-base font-medium text-slate-900">{formatPercent(scopePercent)}</p>
          </div>

          {/* Team Size */}
          <div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Team</p>
            <p className="text-base font-medium text-slate-900">{assignedTeam.length} members</p>
          </div>
        </div>
      </div>

      {/* Scope Progress */}
      <div className="card-body">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-900">Scope Completion</p>
            <p className="text-sm text-slate-600">{release.completedScope}/{release.totalScope} tasks</p>
          </div>
          <ProgressBar
            percent={scopePercent}
            className="h-3"
          />
        </div>
      </div>

      {/* Critical Issues Banner */}
      {criticalIssues.length > 0 && (
        <div className="card-body border-t border-slate-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">⚠️ {criticalIssues.length} Critical Issues</p>
              <p className="text-sm text-red-800 mt-1">
                {criticalIssues.map(i => i.title).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Team Avatars */}
      {assignedTeam.length > 0 && (
        <div className="card-body border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-900 mb-3">Assigned Team</p>
          <TeamAvatars users={assignedTeam} />
        </div>
      )}

      {/* Issues Table */}
      <div className="card-body border-t border-slate-200">
        <p className="text-sm font-semibold text-slate-900 mb-4">Release Items ({issues.length})</p>
        <IssueTable issues={issues} />
      </div>
    </div>
  )
}
