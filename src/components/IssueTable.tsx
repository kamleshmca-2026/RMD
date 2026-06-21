'use client'

import { Issue } from '@/types'
import { formatDate, formatPercent } from '@/lib/formatting'
import { ExternalLink, CheckCircle2, Circle } from 'lucide-react'

interface IssueTableProps {
  issues: Issue[]
}

export default function IssueTable({ issues }: IssueTableProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No issues in this release</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="text-left px-4 py-3 font-semibold text-slate-900 rounded-tl-sm">Title</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-900">Status</th>
            <th className="text-center px-4 py-3 font-semibold text-slate-900">Scope</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-900">Assignee</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-900 rounded-tr-sm">Link</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {issues.map((issue) => (
            <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
              {/* Title */}
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  {issue.state === 'closed' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${
                      issue.state === 'closed'
                        ? 'text-slate-500 line-through'
                        : 'text-slate-900'
                    }`}>
                      {issue.title}
                    </p>
                    {issue.labels.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {issue.labels.slice(0, 2).map((label) => (
                          <span
                            key={label.id}
                            className="inline-flex px-2 py-0.5 rounded-sm text-xs font-medium"
                            style={{
                              backgroundColor: `${label.color}20`,
                              color: `#${label.color}`,
                            }}
                          >
                            {label.name}
                          </span>
                        ))}
                        {issue.labels.length > 2 && (
                          <span className="text-xs text-slate-500">+{issue.labels.length - 2} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-1 rounded-sm text-xs font-medium ${
                  issue.state === 'closed'
                    ? 'bg-green-100 text-green-900'
                    : 'bg-blue-100 text-blue-900'
                }`}>
                  {issue.state === 'closed' ? 'Closed' : 'Open'}
                </span>
              </td>

              {/* Scope */}
              <td className="px-4 py-3 text-center">
                {issue.scope ? (
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <span className="font-medium">{issue.scope.completedTasks}/{issue.scope.totalTasks}</span>
                    <span className="text-xs text-slate-500">({formatPercent(issue.scope.completionPercent)})</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">-</span>
                )}
              </td>

              {/* Assignee */}
              <td className="px-4 py-3">
                {issue.assignee ? (
                  <div className="flex items-center gap-2">
                    {issue.assignee.avatarUrl && (
                      <img
                        src={issue.assignee.avatarUrl}
                        alt={issue.assignee.login}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-slate-600 text-sm">{issue.assignee.login}</span>
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">Unassigned</span>
                )}
              </td>

              {/* Link */}
              <td className="px-4 py-3 text-right">
                <a
                  href={issue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
