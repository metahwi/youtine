# YouTine - Quick Start Guide

Get YouTine up and running in 5 minutes!

## Prerequisites

- Node.js (v14+)
- MongoDB (v4.4+)
- npm or pnpm

## Installation Steps

### 1. Start MongoDB

```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
pnpm install
```

### 4. Start Backend Server

```bash
cd ../server
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
✅ Connected to MongoDB
```

### 5. Start Frontend (New Terminal)

```bash
cd client
pnpm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 6. Open Application

Navigate to: **http://localhost:5173**

## First Steps

1. **Add a video**: Paste any YouTube URL and click "Add Video"
2. **Create a routine**: Click the + button in the sidebar
3. **Build your routine**: Click "Add" on videos to add them to your routine
4. **Reorder videos**: Drag and drop videos using the grip handle
5. **Start working out!** 💪

## Default Configuration

The application comes pre-configured with:

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Database**: mongodb://localhost:27017/youtine

No additional configuration needed for local development!

## Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB is running: `sudo systemctl status mongod`
- Verify port 27017 is not in use

**CORS errors?**
- Ensure both backend and frontend are running
- Check that `.env` files are present in both directories

**Videos not loading?**
- Check browser console for errors
- Verify backend is accessible: `curl http://localhost:5000/api/videos`

## Need More Help?

See the full [README.md](./README.md) for detailed documentation.

---

Happy tracking! 🎯

