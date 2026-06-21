import { NextRequest, NextResponse } from 'next/server'
import PlatformAdapter from '@/api/platform-adapter'
import { Platform } from '@/types'

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

let cachedData: { [key: string]: { data: any; timestamp: number } } = {}

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string; view: string } }
) {
  try {
    const { platform, view } = params
    const validPlatforms = ['github', 'gitlab']
    const validViews = ['active', 'historical', 'planned']

    if (!validPlatforms.includes(platform) || !validViews.includes(view)) {
      return NextResponse.json(
        { error: 'Invalid platform or view' },
        { status: 400 }
      )
    }

    const cacheKey = `${platform}:${view}`
    const cached = cachedData[cacheKey]

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      })
    }

    // Fetch fresh data
    const adapter = new PlatformAdapter(platform as Platform, 10)
    let releases = []

    switch (view) {
      case 'active':
        releases = await adapter.getActiveReleases()
        break
      case 'historical':
        releases = await adapter.getHistoricalReleases()
        break
      case 'planned':
        releases = await adapter.getPlannedReleases()
        break
    }

    const responseData = {
      releases,
      timestamp: new Date().toISOString(),
      platform,
      view,
    }

    // Cache the response
    cachedData[cacheKey] = {
      data: responseData,
      timestamp: Date.now(),
    }

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
