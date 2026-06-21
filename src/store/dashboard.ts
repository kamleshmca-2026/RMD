/**
 * Dashboard State Store
 * Uses Zustand for lightweight state management
 */

import { create } from 'zustand'
import { DashboardState, Release, FilterOptions, Platform } from '@/types'

interface DashboardStore extends DashboardState {
  setReleases: (releases: Release[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error?: string) => void
  setPlatform: (platform: Platform) => void
  setLastUpdated: (timestamp: string) => void
  reset: () => void
}

const initialState: DashboardState = {
  releases: [],
  epics: [],
  isLoading: false,
  error: undefined,
  lastUpdated: undefined,
  platform: 'github',
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...initialState,

  setReleases: (releases) => set({ releases }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPlatform: (platform) => set({ platform }),
  setLastUpdated: (timestamp) => set({ lastUpdated: timestamp }),

  reset: () => set(initialState),
}))

export default useDashboardStore