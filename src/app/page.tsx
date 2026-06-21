'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReleaseView from '@/components/views/ReleaseView'
import { useDashboard } from '@/hooks/useDashboard'

type ViewType = 'active' | 'historical' | 'planned'

export default function Dashboard() {
  const [view, setView] = useState<ViewType>('active')
  const [platform, setPlatform] = useState<'github' | 'gitlab'>('github')
  const { releases, isLoading, error, lastUpdated, refetch } = useDashboard({
    platform,
    view,
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header platform={platform} setPlatform={setPlatform} view={view} setView={setView} />

      <main className="flex-1">
        <div className="max-w-full px-6 py-8">
          {/* View Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">
              {view === 'active' && 'Active Releases'}
              {view === 'historical' && 'Historical Releases'}
              {view === 'planned' && 'Planned Releases'}
            </h1>
            <p className="text-slate-600">
              {view === 'active' &&
                'Upcoming deployment windows and current release cycles'}
              {view === 'historical' &&
                'Releases from the past 10 days'}
              {view === 'planned' &&
                'Future releases and long-term roadmap'}
            </p>
          </div>

          {/* Status Bar */}
          {lastUpdated && (
            <div className="mb-6 flex items-center justify-between text-sm text-slate-500 bg-slate-100 px-4 py-3 rounded-sm">
              <span>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
              <button
                onClick={() => refetch()}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Refresh
              </button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
              <p className="text-red-900 font-medium">Error loading releases</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="card card-body h-32 bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Content */}
          {!isLoading && releases.length > 0 && (
            <div className="space-y-6">
              {releases.map((release) => (
                <ReleaseView key={release.milestone.id} release={release} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && releases.length === 0 && !error && (
            <div className="card card-body text-center py-12">
              <p className="text-slate-600 text-lg">No releases found for this view</p>
              <p className="text-slate-500 text-sm mt-2">
                {view === 'active' &&
                  'Check back soon for upcoming releases'}
                {view === 'historical' &&
                  'No releases completed in the past 10 days'}
                {view === 'planned' &&
                  'No future releases planned'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
