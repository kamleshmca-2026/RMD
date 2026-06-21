'use client'

import { User } from '@/types'
import { getInitials } from '@/lib/formatting'

interface TeamAvatarsProps {
  users: User[]
  maxVisible?: number
}

export default function TeamAvatars({ users, maxVisible = 5 }: TeamAvatarsProps) {
  const visible = users.slice(0, maxVisible)
  const hidden = users.length - visible.length

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((user) => (
        <a
          key={user.id}
          href={user.url}
          target="_blank"
          rel="noopener noreferrer"
          title={user.name || user.login}
          className="relative inline-block"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.login}
              className="w-8 h-8 rounded-full border-2 border-white hover:shadow-lg transition-shadow"
            />
          ) : (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-500 text-white flex items-center justify-center text-xs font-semibold">
              {getInitials(user.name || user.login)}
            </div>
          )}
        </a>
      ))}
      {hidden > 0 && (
        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold hover:bg-slate-300 transition-colors">
          +{hidden}
        </div>
      )}
    </div>
  )
}
