/**
 * Core type definitions for Release Management Dashboard
 */

export type Platform = 'github' | 'gitlab'

export interface PlatformConfig {
  platform: Platform
  token?: string
  apiUrl?: string
}

/**
 * Milestone represents a release window
 * Mapped from GitHub Milestone or GitLab Epic
 */
export interface Milestone {
  id: string | number
  number?: number
  title: string
  description?: string
  dueDate?: string
  startDate?: string
  state: 'open' | 'closed'
  progressPercent?: number
  url: string
  platform: Platform
}

/**
 * Issue represents a release item
 * Aggregated from GitHub Issues or GitLab Issues
 */
export interface Issue {
  id: string | number
  number: number
  title: string
  description: string
  state: 'open' | 'closed'
  labels: Label[]
  milestone?: Milestone
  assignee?: User
  assignees: User[]
  url: string
  createdAt: string
  updatedAt: string
  closedAt?: string
  platform: Platform
  scope?: ScopeMetrics
  epic?: string
}

/**
 * Label/Tag for categorization
 */
export interface Label {
  id: string | number
  name: string
  color: string
  description?: string
}

/**
 * User/Contact information
 */
export interface User {
  id: string | number
  login: string
  name?: string
  avatarUrl?: string
  url: string
}

/**
 * Scope metrics derived from task lists and PRs
 */
export interface ScopeMetrics {
  totalTasks: number
  completedTasks: number
  completionPercent: number
  linkedPRs?: number
}

/**
 * Project/Epic grouping (GitHub Projects or GitLab Epics)
 */
export interface Epic {
  id: string | number
  title: string
  description?: string
  startDate?: string
  endDate?: string
  issues: Issue[]
  url: string
  platform: Platform
}

/**
 * Release view entity combining milestone and its issues
 */
export interface Release {
  milestone: Milestone
  issues: Issue[]
  totalScope: number
  completedScope: number
  scopePercent: number
  criticalIssues: Issue[]
  assignedTeam: User[]
  status: 'active' | 'historical' | 'planned'
}

/**
 * Dashboard data state
 */
export interface DashboardState {
  releases: Release[]
  epics: Epic[]
  isLoading: boolean
  error?: string
  lastUpdated?: string
  platform: Platform
}

/**
 * Filter options for views
 */
export interface FilterOptions {
  milestones?: number[]
  labels?: string[]
  assignees?: string[]
  state?: 'open' | 'closed'
  searchTerm?: string
}

/**
 * Chart data for timeline visualization
 */
export interface TimelineDataPoint {
  date: string
  epic: string
  milestones: number
  issues: number
  completed: number
}