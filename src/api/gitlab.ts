/**
 * GitLab API Client
 * Handles REST API calls to GitLab
 */

import axios, { AxiosInstance } from 'axios'
import { Milestone, Issue, Label, User, ScopeMetrics } from '@/types'

export class GitLabClient {
  private client: AxiosInstance
  private projectId: string
  private apiUrl: string

  constructor(token?: string, projectId?: string, apiUrl?: string) {
    this.projectId = projectId || process.env.NEXT_PUBLIC_GITLAB_PROJECT_ID || ''
    this.apiUrl = apiUrl || process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4'

    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        ...(token && { 'PRIVATE-TOKEN': token }),
      },
    })
  }

  /**
   * Fetch all milestones for the project
   */
  async getMilestones(state: 'active' | 'closed' | 'all' = 'active'): Promise<Milestone[]> {
    try {
      const response = await this.client.get(
        `/projects/${encodeURIComponent(this.projectId)}/milestones`,
        {
          params: { state, per_page: 100 },
        }
      )

      return response.data.map((m: any) => ({
        id: m.id,
        number: m.iid,
        title: m.title,
        description: m.description,
        dueDate: m.due_date,
        startDate: m.start_date,
        state: m.state === 'active' ? 'open' : 'closed',
        progressPercent: m.web_url ? this.calculateProgress(m) : 0,
        url: m.web_url,
        platform: 'gitlab' as const,
      }))
    } catch (error) {
      console.error('Failed to fetch GitLab milestones:', error)
      throw error
    }
  }

  /**
   * Fetch all issues for the project
   */
  async getIssues(state: 'opened' | 'closed' | 'all' = 'opened'): Promise<Issue[]> {
    try {
      const response = await this.client.get(
        `/projects/${encodeURIComponent(this.projectId)}/issues`,
        {
          params: { state, per_page: 100 },
        }
      )

      return response.data.map((i: any) => ({
        id: i.id,
        number: i.iid,
        title: i.title,
        description: i.description || '',
        state: i.state === 'opened' ? 'open' : 'closed',
        labels: i.labels.map((label: string) => ({
          id: label,
          name: label,
          color: '#808080',
        })),
        milestone: i.milestone
          ? {
              id: i.milestone.id,
              number: i.milestone.iid,
              title: i.milestone.title,
              dueDate: i.milestone.due_date,
              state: i.milestone.state === 'active' ? 'open' : 'closed',
              url: i.milestone.web_url,
              platform: 'gitlab' as const,
            }
          : undefined,
        assignee: i.assignee
          ? {
              id: i.assignee.id,
              login: i.assignee.username,
              name: i.assignee.name,
              avatarUrl: i.assignee.avatar_url,
              url: i.assignee.web_url,
            }
          : undefined,
        assignees: i.assignees.map((a: any) => ({
          id: a.id,
          login: a.username,
          name: a.name,
          avatarUrl: a.avatar_url,
          url: a.web_url,
        })),
        url: i.web_url,
        createdAt: i.created_at,
        updatedAt: i.updated_at,
        closedAt: i.closed_at,
        platform: 'gitlab' as const,
        scope: this.extractScopeMetrics(i.description),
        epic: i.epic?.title,
      }))
    } catch (error) {
      console.error('Failed to fetch GitLab issues:', error)
      throw error
    }
  }

  /**
   * Fetch issues by milestone
   */
  async getIssuesByMilestone(
    milestoneId: number,
    state: 'opened' | 'closed' | 'all' = 'opened'
  ): Promise<Issue[]> {
    try {
      const response = await this.client.get(
        `/projects/${encodeURIComponent(this.projectId)}/milestones/${milestoneId}/issues`,
        {
          params: { state, per_page: 100 },
        }
      )

      return response.data.map((i: any) => ({
        id: i.id,
        number: i.iid,
        title: i.title,
        description: i.description || '',
        state: i.state === 'opened' ? 'open' : 'closed',
        labels: i.labels || [],
        milestone: { id: milestoneId, title: '', state: 'open', url: '', platform: 'gitlab' },
        assignee: i.assignee,
        assignees: i.assignees || [],
        url: i.web_url,
        createdAt: i.created_at,
        updatedAt: i.updated_at,
        closedAt: i.closed_at,
        platform: 'gitlab' as const,
        scope: this.extractScopeMetrics(i.description),
      }))
    } catch (error) {
      console.error(`Failed to fetch GitLab issues for milestone ${milestoneId}:`, error)
      throw error
    }
  }

  /**
   * Fetch epics (GitLab-specific)
   */
  async getEpics() {
    try {
      const response = await this.client.get(
        `/groups/${encodeURIComponent(this.projectId)}/epics`,
        {
          params: { per_page: 100 },
        }
      )

      return response.data
    } catch (error) {
      console.error('Failed to fetch GitLab epics:', error)
      return []
    }
  }

  /**
   * Extract scope metrics from issue description (task lists)
   */
  private extractScopeMetrics(description: string | null): ScopeMetrics | undefined {
    if (!description) return undefined

    const checkboxPattern = /- \[([ xX])\]/g
    const matches = description.matchAll(checkboxPattern)

    let totalTasks = 0
    let completedTasks = 0

    for (const match of matches) {
      totalTasks++
      if (match[1].toLowerCase() === 'x') {
        completedTasks++
      }
    }

    if (totalTasks === 0) return undefined

    return {
      totalTasks,
      completedTasks,
      completionPercent: Math.round((completedTasks / totalTasks) * 100),
    }
  }

  /**
   * Calculate progress from GitLab milestone stats
   */
  private calculateProgress(milestone: any): number {
    if (!milestone.closed_issues || !milestone.opened_issues) return 0
    const total = milestone.closed_issues + milestone.opened_issues
    return Math.round((milestone.closed_issues / total) * 100)
  }
}

export default GitLabClient