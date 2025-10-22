# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouTine is a full-stack fitness application that combines YouTube workout videos with routine management and workout tracking. It features a minimalist, premium design inspired by Technogym with a yellow (#FFE01E) and black (#000000) color palette.

**Stack**: React 19 + Vite frontend, Node.js + Express backend, MongoDB database

## Common Commands

### Development
```bash
# Frontend development (hot-reload)
cd client
pnpm run dev          # Starts dev server on port 5173

# Backend
cd server
node server-production.js  # Production server on port 3000
node server.js             # Development server
npm run dev               # With nodemon

# Build frontend
cd client
pnpm run build       # Output to client/dist/
```

### Testing & Linting
```bash
cd client
pnpm test            # Run tests with Vitest
pnpm test:ui         # Run tests with UI
pnpm test:coverage   # Run tests with coverage
pnpm run lint        # ESLint
pnpm run format      # Format code with Prettier
pnpm run format:check # Check formatting
pnpm run preview     # Preview production build
```

### MongoDB
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Linux

# Verify connection
mongosh --eval "db.version()"
```

## Architecture

### Data Flow
1. **Video Addition**: User pastes YouTube URL → Backend extracts metadata using ytdl-core → Video saved to MongoDB
2. **Routine Management**: Videos organized into Routines (many-to-many via ObjectId references)
3. **Workout Logging**: WorkoutLog documents reference both Videos and Routines, with optional OpenAI analysis
4. **Dashboard**: Aggregates WorkoutLog data for statistics and calendar visualization

### Key Models (server/models/)
- **Video**: Stores YouTube video metadata (url, title, thumbnail, duration), plus AI analysis (segments, status)
- **Routine**: Contains name, description, and array of Video ObjectIds
- **WorkoutLog**: Records individual workout sessions with exercise details (sets, reps, weight)
- **ScheduledRoutine**: Handles routine scheduling with recurrence patterns

### Frontend Structure (client/src/)
- **App.jsx**: Main component managing view state (dashboard/library/logger) and data fetching
- **components/**: UI components including VideoCard, RoutineList, DashboardPage, WorkoutLogger
- **contexts/LanguageContext**: Handles bilingual support (English/Korean)
- **i18n/translations.js**: All translation strings
- **services/api.js**: Axios-based API client (videoAPI, routineAPI, logAPI, dashboardAPI)

### Backend Structure (server/)
- **server-production.js**: Entry point serving static client build + API routes
- **routes/**: Express routes for videos, routines, logs, dashboard, schedule
- **services/**: Business logic (currently AI analysis service for OpenAI integration)

### State Management
App.jsx uses useState hooks for global state:
- `videos`: All saved YouTube videos
- `routines`: All workout routines
- `activeRoutineId`/`activeRoutine`: Currently selected routine
- `playingVideo`: Video currently in player
- `currentView`: Navigation state (dashboard/library/logger)
- `loggingVideo`: Video being logged in WorkoutLogger

## Important Configuration

### Environment Variables

**server/.env**:
```env
MONGODB_URI=mongodb://localhost:27017/youtine
PORT=3000                              # Avoid 5000 (macOS AirPlay conflict)
OPENAI_API_KEY=sk-...                  # Optional, for AI analysis
```

**client/.env**:
```env
VITE_API_URL=/api                      # Production uses same origin
```

### Production Deployment
The production server (server-production.js) serves the built React app from `../client/dist/`. API routes are at `/api/*`, all other routes fall through to `index.html` (SPA routing).

## Design System

### Colors (Technogym-inspired)
- Primary Yellow: `#FFE01E` (CTAs, highlights)
- Black: `#000000` (text, active states)
- Dark Grey: `#2C2C2C` (secondary text)
- Light Grey: `#F5F5F5` (backgrounds)

### Component Patterns
- Buttons: Yellow primary (black text), black secondary (white text)
- Navigation: Black background when active
- Cards: White with subtle shadows, 8px border radius
- Use semibold/bold weights for emphasis

## API Endpoints

### Videos
- `POST /api/videos` - Add YouTube video (body: `{ url }`)
- `GET /api/videos` - List all videos
- `DELETE /api/videos/:id` - Remove video

### Routines
- `POST /api/routines` - Create routine (body: `{ name, description?, videos? }`)
- `GET /api/routines` - List all routines
- `GET /api/routines/:id` - Get routine with populated video details
- `PUT /api/routines/:id` - Update routine (supports reordering videos)
- `DELETE /api/routines/:id` - Remove routine

### Workout Logs
- `POST /api/logs` - Create log (body: `{ videoId, exercises[], notes?, date? }`)
- `GET /api/logs` - List all logs
- `PUT /api/logs/:id` - Update log
- `DELETE /api/logs/:id` - Remove log

### Dashboard
- `GET /api/dashboard/stats` - Workout statistics (count, streak, etc.)
- `GET /api/dashboard/calendar` - Calendar data with workout markers

### Schedule
- `POST /api/schedule` - Create scheduled routine
- `GET /api/schedule` - List scheduled routines

## Bilingual Support

All user-facing text uses the `t()` function from LanguageContext:
```jsx
import { useLanguage } from './contexts/LanguageContext';
const { t, language, switchLanguage } = useLanguage();

// Usage
<h1>{t('appName')}</h1>  // "YouTine"
<button>{t('addVideo')}</button>
```

Translation keys are in `client/src/i18n/translations.js` with both `en` and `ko` objects.

## Key Dependencies

### Frontend
- `@hello-pangea/dnd`: Drag-and-drop for reordering videos in routines
- `@radix-ui/*`: Unstyled UI primitives (dialogs, dropdowns, etc.)
- `date-fns`: Date formatting
- `lucide-react`: Icon components
- `react-calendar`: Calendar widget for workout tracking

### Backend
- `@distube/ytdl-core`, `ytdl-core`: YouTube video metadata extraction
- `youtube-transcript`: Fetch video transcripts
- `openai`: AI workout analysis (optional feature)
- `mongoose`: MongoDB ODM

## Package Managers
- **Client**: Uses pnpm (specified in packageManager field)
- **Server**: Uses npm

## Common Tasks

### Add a new API endpoint
1. Create route handler in `server/routes/`
2. Register route in `server-production.js` or `server.js`
3. Add corresponding API function in `client/src/services/api.js`
4. Update components to call the new API function

### Add translations
Edit `client/src/i18n/translations.js` and add keys to both `en` and `ko` objects.

### Debug MongoDB issues
Check connection string in `server/.env` matches running MongoDB instance. Default database name is `youtine` (changed from `idamfit` during rebranding).

### Modify color scheme
Update CSS variables in `client/src/App.css` and Tailwind config. Primary colors are `#FFE01E` (yellow) and `#000000` (black).

## Code Quality Tools

### Logging
- **Client**: Use `logger` from `client/src/utils/logger.js` instead of console.log
- **Server**: Use `logger` from `server/utils/logger.js` with structured logging

Example:
```javascript
import { createLogger } from './utils/logger';
const logger = createLogger('ComponentName');

logger.info('User logged in');
logger.error('Failed to fetch data:', error);
```

### Error Handling
- All components are wrapped in `ErrorBoundary` (see `client/src/components/ErrorBoundary.jsx`)
- Errors are automatically caught and displayed with fallback UI
- In development, full error details are shown

### Testing
- Test framework: Vitest + React Testing Library
- Test files: `*.test.js` or `*.test.jsx` next to source files
- Run tests: `pnpm test` (client directory)
- Coverage: `pnpm test:coverage`

Example test:
```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Code Formatting
- Prettier is configured for consistent code style
- Format before committing: `pnpm run format`
- Configuration: `.prettierrc` in client directory

## Performance Notes

### Bundle Size
- Current: ~403KB JS + 94KB CSS (uncompressed)
- See `client/UNUSED_DEPENDENCIES.md` for optimization opportunities
- ~35 Radix UI packages are installed but unused (potential 30-40% reduction)

### Optimization Recommendations
1. Remove unused Radix UI packages
2. Implement code splitting with React.lazy()
3. Add React.memo to frequently re-rendering components
4. Consider virtual scrolling for large lists
