/**
 * Platform Adapter
 * Abstraction layer supporting both GitHub and GitLab
 */

import GitHubClient from './github'
import GitLabClient from './gitlab'
import { Platform, Milestone, Issue, Epic, Release } from '@/types'
import { subDays, isAfter, isBefore, parseISO } from 'date-fns'

export class PlatformAdapter {
  private github?: GitHubClient
  private gitlab?: GitLabClient
  private platform: Platform
  private historicalDaysBack: number

  constructor(platform: Platform = 'github', historicalDaysBack: number = 10) {
    this.platform = platform
    this.historicalDaysBack = historicalDaysBack

    if (platform === 'github') {
      this.github = new GitHubClient(
        process.env.GITHUB_TOKEN,
        process.env.NEXT_PUBLIC_GITHUB_OWNER,
        process.env.NEXT_PUBLIC_GITHUB_REPO
      )
    } else if (platform === 'gitlab') {
      this.gitlab = new GitLabClient(
        process.env.GITLAB_TOKEN,
        process.env.NEXT_PUBLIC_GITLAB_PROJECT_ID,
        process.env.GITLAB_API_URL
      )
    }
  }

  /**
   * Fetch all active releases (milestones with future or today due dates)
   */
  async getActiveReleases(): Promise<Release[]> {
    const milestones = await this.getMilestones('open')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activeMilestones = milestones.filter((m) => {
      if (!m.dueDate) return true
      const dueDate = parseISO(m.dueDate)
      return isAfter(dueDate, subDays(today, 1))
    })

    return Promise.all(activeMilestones.map((m) => this.buildRelease(m, 'active')))
  }

  /**
   * Fetch historical releases (milestones closed in past N days)
   */
  async getHistoricalReleases(): Promise<Release[]> {
    const milestones = await this.getMilestones('closed')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const cutoffDate = subDays(today, this.historicalDaysBack)

    const historicalMilestones = milestones.filter((m) => {
      if (!m.dueDate) return false
      const dueDate = parseISO(m.dueDate)
      return isBefore(dueDate, today) && isAfter(dueDate, cutoffDate)
    })

    return Promise.all(historicalMilestones.map((m) => this.buildRelease(m, 'historical')))
  }

  /**
   * Fetch planned releases (milestones far in future)
   */
  async getPlannedReleases(): Promise<Release[]> {
    const milestones = await this.getMilestones('open')
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const plannedMilestones = milestones.filter((m) => {
      if (!m.dueDate) return true
      const dueDate = parseISO(m.dueDate)
      return isAfter(dueDate, today)
    })

    return Promise.all(plannedMilestones.map((m) => this.buildRelease(m, 'planned')))
  }

  /**
   * Build a Release object combining milestone and its issues
   */
  private async buildRelease(milestone: Milestone, status: 'active' | 'historical' | 'planned'): Promise<Release> {
    const issues = await this.getIssuesByMilestone(milestone.number || (milestone.id as number))

    const totalScope = issues.reduce((sum, i) => sum + (i.scope?.totalTasks || 0), 0)
    const completedScope = issues.reduce((sum, i) => sum + (i.scope?.completedTasks || 0), 0)

    const criticalIssues = issues.filter((i) =>
      i.labels.some((l) => ['blocker', 'critical', 'p0', 'p1'].includes(l.name.toLowerCase()))
    )

    const assignedTeam = Array.from(
      new Map(
        issues
          .filter((i) => i.assignee)
          .map((i) => [i.assignee!.id, i.assignee!])
          .entries()
      ).values()
    )

    return {
      milestone,
      issues,
      totalScope,
      completedScope,
      scopePercent: totalScope > 0 ? Math.round((completedScope / totalScope) * 100) : 0,
      criticalIssues,
      assignedTeam,
      status,
    }
  }

  /**
   * Get milestones by state
   */
  async getMilestones(state: 'open' | 'closed' | 'all' = 'open'): Promise<Milestone[]> {
    if (this.platform === 'github' && this.github) {
      return this.github.getMilestones(state as any)
    } else if (this.platform === 'gitlab' && this.gitlab) {
      const glState = state === 'open' ? 'active' : state === 'closed' ? 'closed' : 'all'
      return this.gitlab.getMilestones(glState as any)
    }
    return []
  }

  /**
   * Get all issues
   */
  async getIssues(state: 'open' | 'closed' | 'all' = 'open'): Promise<Issue[]> {
    if (this.platform === 'github' && this.github) {
      return this.github.getIssues(state as any)
    } else if (this.platform === 'gitlab' && this.gitlab) {
      const glState = state === 'open' ? 'opened' : state === 'closed' ? 'closed' : 'all'
      return this.gitlab.getIssues(glState as any)
    }
    return []
  }

  /**
   * Get issues by milestone
   */
  async getIssuesByMilestone(milestoneNumber: number | string): Promise<Issue[]> {
    if (this.platform === 'github' && this.github) {
      return this.github.getIssuesByMilestone(milestoneNumber as number)
    } else if (this.platform === 'gitlab' && this.gitlab) {
      return this.gitlab.getIssuesByMilestone(milestoneNumber as number)
    }
    return []
  }

  /**
   * Get platform epics (projects for GitHub, epics for GitLab)
   */
  async getEpics(): Promise<Epic[]> {
    // TODO: Implement when GitHub Projects API becomes available
    return []
  }
}

export default PlatformAdapter