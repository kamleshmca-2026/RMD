/**
 * GitHub API Client
 * Handles REST API calls to GitHub
 */

import axios, { AxiosInstance } from 'axios'
import { Milestone, Issue, Label, User, ScopeMetrics } from '@/types'

const GITHUB_API_BASE = 'https://api.github.com'

export class GitHubClient {
  private client: AxiosInstance
  private owner: string
  private repo: string

  constructor(token?: string, owner?: string, repo?: string) {
    this.owner = owner || process.env.NEXT_PUBLIC_GITHUB_OWNER || ''
    this.repo = repo || process.env.NEXT_PUBLIC_GITHUB_REPO || ''

    this.client = axios.create({
      baseURL: GITHUB_API_BASE,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(token && { Authorization: `token ${token}` }),
      },
    })
  }

  /**
   * Fetch all milestones for the repository
   */
  async getMilestones(state: 'open' | 'closed' | 'all' = 'open'): Promise<Milestone[]> {
    try {
      const response = await this.client.get(
        `/repos/${this.owner}/${this.repo}/milestones`,
        {
          params: { state, per_page: 100 },
        }
      )

      return response.data.map((m: any) => ({
        id: m.id,
        number: m.number,
        title: m.title,
        description: m.description,
        dueDate: m.due_on,
        startDate: m.created_at,
        state: m.state,
        progressPercent: m.open_issues ? (m.closed_issues / (m.closed_issues + m.open_issues)) * 100 : 0,
        url: m.html_url,
        platform: 'github' as const,
      }))
    } catch (error) {
      console.error('Failed to fetch GitHub milestones:', error)
      throw error
    }
  }

  /**
   * Fetch all issues for the repository
   */
  async getIssues(state: 'open' | 'closed' | 'all' = 'open'): Promise<Issue[]> {
    try {
      const response = await this.client.get(`/repos/${this.owner}/${this.repo}/issues`, {
        params: { state, per_page: 100 },
      })

      return response.data.map((i: any) => ({
        id: i.id,
        number: i.number,
        title: i.title,
        description: i.body || '',
        state: i.state,
        labels: i.labels.map((l: any) => ({
          id: l.id,
          name: l.name,
          color: l.color,
          description: l.description,
        })),
        milestone: i.milestone
          ? {
              id: i.milestone.id,
              number: i.milestone.number,
              title: i.milestone.title,
              dueDate: i.milestone.due_on,
              state: i.milestone.state,
              url: i.milestone.html_url,
              platform: 'github' as const,
            }
          : undefined,
        assignee: i.assignee
          ? {
              id: i.assignee.id,
              login: i.assignee.login,
              name: i.assignee.name,
              avatarUrl: i.assignee.avatar_url,
              url: i.assignee.html_url,
            }
          : undefined,
        assignees: i.assignees.map((a: any) => ({
          id: a.id,
          login: a.login,
          name: a.name,
          avatarUrl: a.avatar_url,
          url: a.html_url,
        })),
        url: i.html_url,
        createdAt: i.created_at,
        updatedAt: i.updated_at,
        closedAt: i.closed_at,
        platform: 'github' as const,
        scope: this.extractScopeMetrics(i.body),
      }))
    } catch (error) {
      console.error('Failed to fetch GitHub issues:', error)
      throw error
    }
  }

  /**
   * Fetch issues by milestone
   */
  async getIssuesByMilestone(
    milestoneNumber: number,
    state: 'open' | 'closed' | 'all' = 'open'
  ): Promise<Issue[]> {
    try {
      const response = await this.client.get(`/repos/${this.owner}/${this.repo}/issues`, {
        params: { milestone: milestoneNumber, state, per_page: 100 },
      })

      return response.data.map((i: any) => ({
        id: i.id,
        number: i.number,
        title: i.title,
        description: i.body || '',
        state: i.state,
        labels: i.labels || [],
        milestone: i.milestone,
        assignee: i.assignee,
        assignees: i.assignees || [],
        url: i.html_url,
        createdAt: i.created_at,
        updatedAt: i.updated_at,
        closedAt: i.closed_at,
        platform: 'github' as const,
        scope: this.extractScopeMetrics(i.body),
      }))
    } catch (error) {
      console.error(`Failed to fetch GitHub issues for milestone ${milestoneNumber}:`, error)
      throw error
    }
  }

  /**
   * Extract scope metrics from issue body (task lists)
   * Counts checkbox items like:
   * - [ ] Task 1
   * - [x] Task 2
   */
  private extractScopeMetrics(bodyText: string | null): ScopeMetrics | undefined {
    if (!bodyText) return undefined

    const checkboxPattern = /- \[([ xX])\]/g
    const matches = bodyText.matchAll(checkboxPattern)

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
   * Get repository details
   */
  async getRepository() {
    try {
      const response = await this.client.get(`/repos/${this.owner}/${this.repo}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch GitHub repository:', error)
      throw error
    }
  }
}

export default GitHubClient