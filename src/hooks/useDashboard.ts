/**
 * useDashboard Hook
 * Fetches and manages dashboard data using SWR for caching
 */

import useSWR from 'swr'
import { Release, Platform } from '@/types'
import { useDashboardStore } from '@/store/dashboard'
import { useEffect } from 'react'

const REFRESH_INTERVAL = parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL || '300000', 10)

interface UseDashboardOptions {
  platform?: Platform
  view?: 'active' | 'historical' | 'planned'
  enabled?: boolean
}

export const useDashboard = (options: UseDashboardOptions = {}) => {
  const { platform = 'github', view = 'active', enabled = true } = options
  const { setReleases, setLoading, setError, setLastUpdated } = useDashboardStore()

  const { data, error, isLoading, mutate } = useSWR<{
    releases: Release[]
    timestamp: string
  }>(
    enabled ? `/api/dashboard/${platform}/${view}` : null,
    async (url) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      return response.json()
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
      focusThrottleInterval: 150000,
      refreshInterval: REFRESH_INTERVAL,
    }
  )

  useEffect(() => {
    if (isLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [isLoading, setLoading])

  useEffect(() => {
    if (data) {
      setReleases(data.releases)
      setLastUpdated(data.timestamp)
      setError(undefined)
    }
  }, [data, setReleases, setLastUpdated, setError])

  useEffect(() => {
    if (error) {
      setError(error.message)
    }
  }, [error, setError])

  return {
    releases: data?.releases || [],
    isLoading,
    error: error?.message,
    lastUpdated: data?.timestamp,
    refetch: mutate,
  }
}

export default useDashboard