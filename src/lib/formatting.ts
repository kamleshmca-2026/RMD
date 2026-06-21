/**
 * Formatting utilities
 */

import { format, formatDistance, parseISO, isValid } from 'date-fns'

/**
 * Format date for display
 */
export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '-'
  try {
    const date = parseISO(dateStr)
    return isValid(date) ? format(date, 'MMM dd, yyyy') : '-'
  } catch {
    return '-'
  }
}

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export const formatRelativeDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '-'
  try {
    const date = parseISO(dateStr)
    return isValid(date) ? formatDistance(date, new Date(), { addSuffix: true }) : '-'
  } catch {
    return '-'
  }
}

/**
 * Format date for ISO display
 */
export const formatISO = (dateStr: string | undefined): string => {
  if (!dateStr) return '-'
  try {
    const date = parseISO(dateStr)
    return isValid(date) ? format(date, 'yyyy-MM-dd') : '-'
  } catch {
    return '-'
  }
}

/**
 * Format percentage
 */
export const formatPercent = (percent: number | undefined): string => {
  if (percent === undefined || percent === null) return '-'
  return `${Math.round(percent)}%`
}

/**
 * Format large numbers (e.g., 1K, 2.5M)
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  return `${(num / 1000000).toFixed(1)}M`
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Parse markdown task list and return metrics
 */
export const parseTaskList = (markdown: string): { total: number; completed: number } => {
  const pattern = /- \[([ xX])\]/g
  const matches = markdown.matchAll(pattern)

  let total = 0
  let completed = 0

  for (const match of matches) {
    total++
    if (match[1].toLowerCase() === 'x') {
      completed++
    }
  }

  return { total, completed }
}

/**
 * Get color for label
 */
export const getLabelColor = (labelName: string): string => {
  const colorMap: { [key: string]: string } = {
    blocker: '#d32f2f',
    critical: '#f57c00',
    p0: '#d32f2f',
    p1: '#f57c00',
    p2: '#fbc02d',
    enhancement: '#1976d2',
    bug: '#d32f2f',
    documentation: '#2196f3',
    feature: '#1976d2',
  }

  const key = labelName.toLowerCase()
  return colorMap[key] || '#808080'
}

/**
 * Generate initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Format GitHub/GitLab URL to be display-friendly
 */
export const formatUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname + urlObj.pathname
  } catch {
    return url
  }
}