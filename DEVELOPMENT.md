# Development Guide

## Getting Started

### Prerequisites
- Node.js 22.x or higher
- MongoDB 7.x or higher
- pnpm (for client) or npm (for server)

### Initial Setup
```bash
# 1. Install client dependencies
cd client
pnpm install

# 2. Install server dependencies
cd ../server
npm install

# 3. Set up environment variables
# Copy .env.example to .env in both client and server directories
# Update with your actual values

# 4. Start MongoDB
brew services start mongodb-community  # macOS

# 5. Run in development mode
# Terminal 1 - Backend
cd server
node server-production.js

# Terminal 2 - Frontend
cd client
pnpm run dev
```

## Development Workflow

### Before Starting Work
1. Pull latest changes
2. Install any new dependencies
3. Check for migration scripts

### While Developing
1. **Use the logger utilities** instead of console.log
2. **Write tests** for new features
3. **Format code** with Prettier before committing
4. **Check ESLint** warnings

### Before Committing
```bash
# Format code
cd client
pnpm run format

# Run linter
pnpm run lint

# Run tests
pnpm test

# Build to ensure no build errors
pnpm run build
```

## Code Style Guide

### JavaScript/React
- Use functional components with hooks
- Prefer const over let, never use var
- Use arrow functions
- Destructure props
- Keep components small and focused

### Logging
```javascript
// Client-side
import { createLogger } from '@/utils/logger';
const logger = createLogger('FeatureName');

logger.info('User action');
logger.error('Error occurred:', error);

// Server-side
const { createLogger } = require('./utils/logger');
const logger = createLogger('api:videos');

logger.success('Video added successfully');
logger.error('Failed to fetch video:', error);
```

### Error Handling
```javascript
// Always wrap async operations in try-catch
try {
  const data = await fetchData();
  logger.info('Data fetched successfully');
} catch (error) {
  logger.error('Failed to fetch data:', error);
  // Handle error appropriately
}
```

### Testing
```javascript
// Name tests descriptively
describe('VideoCard', () => {
  it('should display video title', () => {
    // Test implementation
  });

  it('should call onDelete when delete button is clicked', () => {
    // Test implementation
  });
});
```

## Project Structure

### Client Architecture
```
client/src/
├── components/          # React components
│   ├── ErrorBoundary.jsx
│   ├── VideoCard.jsx
│   └── ...
├── contexts/           # React contexts (Language)
├── services/           # API calls (api.js)
├── utils/             # Utilities (logger.js)
├── i18n/              # Translations (EN/KO)
└── test/              # Test setup
```

### Server Architecture
```
server/
├── models/            # Mongoose models
│   ├── Video.js
│   ├── Routine.js
│   └── WorkoutLog.js
├── routes/            # Express routes
│   ├── videos.js
│   ├── routines.js
│   └── logs.js
├── services/          # Business logic
│   └── aiAnalysis.js
└── utils/             # Utilities
    └── logger.js
```

## Testing Strategy

### Unit Tests
- Test individual functions and utilities
- Located next to the source file (e.g., `logger.test.js`)
- Use Vitest + Jest DOM

### Component Tests
- Test React components in isolation
- Use React Testing Library
- Focus on user interactions

### Integration Tests
- Test API routes
- Test database interactions
- Use Supertest (to be implemented)

## Common Tasks

### Adding a New Feature
1. Create feature branch
2. Implement feature with tests
3. Update translations if needed (i18n/translations.js)
4. Test locally
5. Create pull request

### Adding a New API Endpoint
1. Define route in `server/routes/`
2. Create/update model in `server/models/`
3. Add business logic in `server/services/` if complex
4. Update `client/src/services/api.js`
5. Write tests

### Fixing a Bug
1. Write a failing test that reproduces the bug
2. Fix the bug
3. Ensure test passes
4. Check for similar bugs elsewhere

## Performance Optimization

### Current Issues
- Large bundle size (403KB JS)
- Many unused dependencies (see `client/UNUSED_DEPENDENCIES.md`)
- No code splitting
- No React.memo usage

### Optimization Checklist
- [ ] Remove unused Radix UI packages
- [ ] Implement code splitting
- [ ] Add React.memo to expensive components
- [ ] Optimize images
- [ ] Add service worker for caching

## Troubleshooting

### Tests Failing
```bash
# Clear test cache
cd client
rm -rf node_modules/.vitest
pnpm test
```

### Build Errors
```bash
# Clean and rebuild
cd client
rm -rf node_modules dist .vite
pnpm install
pnpm run build
```

### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb-community
```

### Port Already in Use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

## Useful Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Vitest Documentation](https://vitest.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Code Review Checklist

Before requesting review:
- [ ] Code is formatted (pnpm run format)
- [ ] No ESLint warnings
- [ ] Tests pass
- [ ] Build succeeds
- [ ] Translations updated (if UI changes)
- [ ] Error handling in place
- [ ] Logging instead of console.log
- [ ] README/docs updated if needed

## Getting Help

1. Check existing documentation (README, CLAUDE.md, this file)
2. Search closed issues/PRs
3. Ask in team chat
4. Create an issue with reproduction steps

---

**Last Updated**: 2025-10-19
**Maintainer**: YouTine Team
