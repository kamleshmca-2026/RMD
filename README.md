# Release Management Dashboard (RMD)

A high-performance, real-time Release Management Dashboard for tracking GitHub and GitLab releases with detailed milestone, issue, and team insights.

## Features

### 📊 Core Functionality
- **Active Releases**: Real-time tracking of current and upcoming deployment windows
- **Historical Releases**: Audit trail of releases from the past 10 days
- **Planned Releases**: Long-term roadmap visualization
- **Dual Platform Support**: Seamless GitHub and GitLab integration

### 🎯 Release Tracking
- **Milestone Management**: Track releases via milestone due dates
- **Issue Aggregation**: Automatic collection of issues linked to milestones
- **Scope Metrics**: Task completion tracking via GitHub/GitLab task lists
- **Team Assignment**: View assigned contributors for each release
- **Critical Issues**: Automatic flagging of blocker and priority issues

### 🎨 User Experience
- **Swiss Design**: Premium, corporate aesthetic with high legibility
- **Responsive Layout**: Mobile-first design for all screen sizes
- **Real-time Updates**: Auto-refresh with configurable intervals
- **Smart Caching**: Intelligent data caching for optimal performance
- **Accessibility**: WCAG AA compliant for modern browser support

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State**: Zustand for client state, SWR for data fetching
- **APIs**: GitHub REST API, GitLab REST API
- **Utilities**: date-fns, Recharts (for future timeline visualization)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- GitHub or GitLab personal access token

### Installation

```bash
# Clone the repository
git clone https://github.com/kamleshmca-2026/RMD.git
cd RMD

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your credentials
# GITHUB_TOKEN=your_token
# NEXT_PUBLIC_GITHUB_OWNER=your_owner
# NEXT_PUBLIC_GITHUB_REPO=your_repo
```

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Production

```bash
npm run build
npm start
```

## Configuration

### Environment Variables

**GitHub**
```env
GITHUB_TOKEN=your_github_personal_access_token
NEXT_PUBLIC_GITHUB_OWNER=your_username_or_org
NEXT_PUBLIC_GITHUB_REPO=your_repository
```

**GitLab** (Optional)
```env
GITLAB_TOKEN=your_gitlab_personal_access_token
GITLAB_API_URL=https://gitlab.com/api/v4
NEXT_PUBLIC_GITLAB_PROJECT_ID=your_project_id
```

**Dashboard**
```env
NEXT_PUBLIC_REFRESH_INTERVAL=300000  # 5 minutes in ms
NEXT_PUBLIC_HISTORICAL_DAYS_BACK=10  # Days for historical view
```

## Architecture

### Data Flow

1. **Client** → Requests dashboard view (Active/Historical/Planned)
2. **API Route** → `/api/dashboard/[platform]/[view]`
3. **Platform Adapter** → Translates GitHub/GitLab APIs
4. **API Clients** → GitHub REST or GitLab REST
5. **Cache** → 5-minute intelligent caching
6. **Component** → Renders release cards with metrics

### Key Components

- **Header**: Navigation with platform & view switching
- **ReleaseView**: Main release card with all metrics
- **IssueTable**: Detailed table of issues per release
- **ProgressBar**: Visual scope completion indicator
- **TeamAvatars**: Avatar stack of assigned team members

## API Routes

### GET `/api/dashboard/[platform]/[view]`

Fetch releases for a specific platform and view.

**Parameters**
- `platform`: `github` or `gitlab`
- `view`: `active`, `historical`, or `planned`

**Response**
```json
{
  "releases": [
    {
      "milestone": { ... },
      "issues": [ ... ],
      "totalScope": 42,
      "completedScope": 28,
      "scopePercent": 67,
      "criticalIssues": [ ... ],
      "assignedTeam": [ ... ],
      "status": "active"
    }
  ],
  "timestamp": "2026-06-21T19:30:00.000Z",
  "platform": "github",
  "view": "active"
}
```

## Data Mapping

### Release Date
- **Source**: Milestone `due_date` field
- **Logic**: Compared against current date for view filtering

### Scope Metrics
- **Source**: Issue body markdown task lists (`- [ ]`, `- [x]`)
- **Calculation**: `completed / total * 100`

### Team Contacts
- **Source**: Issue `assignees` field (primary assignee displayed)
- **Display**: Avatar stack with hover details

### Critical Issues
- **Detection**: Labels matching `blocker`, `critical`, `p0`, `p1`
- **Display**: Highlighted banner at release level

## Filtering Logic

### Active Releases
```
milestone.due_date >= TODAY
```

### Historical Releases
```
milestone.due_date >= (TODAY - 10 days)
AND
milestone.due_date < TODAY
```

### Planned Releases
```
milestone.due_date > TODAY
```

## Browser Support

- Chrome/Chromium (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Accessibility

- WCAG 2.1 Level AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators on all interactive elements

## Performance

- **Response Time**: < 200ms (cached)
- **First Load**: < 2s
- **Data Caching**: 5-minute TTL
- **Auto-refresh**: Configurable intervals
- **Bundle Size**: ~120KB gzipped

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- 📧 Email: support@example.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/kamleshmca-2026/RMD/issues)
- 📖 Documentation: [Wiki](https://github.com/kamleshmca-2026/RMD/wiki)

## Roadmap

- [ ] GitHub Projects integration for Epic grouping
- [ ] GitLab Epics native support
- [ ] Gantt timeline visualization
- [ ] Release comparison analytics
- [ ] Custom filters & saved views
- [ ] Slack notifications
- [ ] Webhook integrations
- [ ] Export to PDF/CSV

---

**Made with ❤️ for Release Management Teams**
