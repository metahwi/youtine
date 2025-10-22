import axios from 'axios';

// Use relative URL in production (same origin), localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Video API calls
export const videoAPI = {
  // Add a new video
  addVideo: async (url) => {
    const response = await api.post('/videos', { url });
    return response.data;
  },

  // Get all videos
  getAllVideos: async () => {
    const response = await api.get('/videos');
    return response.data;
  },

  // Get a single video by ID
  getVideo: async (id) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  // Delete a video
  deleteVideo: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },
};

// Routine API calls
export const routineAPI = {
  // Create a new routine
  createRoutine: async (name, description = '') => {
    const response = await api.post('/routines', { name, description });
    return response.data;
  },

  // Get all routines
  getAllRoutines: async () => {
    const response = await api.get('/routines');
    return response.data;
  },

  // Get a single routine with populated videos
  getRoutine: async (id) => {
    const response = await api.get(`/routines/${id}`);
    return response.data;
  },

  // Update a routine (add, remove, or reorder videos)
  updateRoutine: async (id, updateData) => {
    const response = await api.put(`/routines/${id}`, updateData);
    return response.data;
  },

  // Delete a routine
  deleteRoutine: async (id) => {
    const response = await api.delete(`/routines/${id}`);
    return response.data;
  },
};

// Workout Log API calls (Phase 2)
export const logAPI = {
  // Create a new workout log
  createLog: async (logData) => {
    const response = await api.post('/logs', logData);
    return response.data;
  },

  // Get all logs with optional filtering
  getLogs: async (params = {}) => {
    const response = await api.get('/logs', { params });
    return response.data;
  },

  // Get a single log by ID
  getLog: async (id) => {
    const response = await api.get(`/logs/${id}`);
    return response.data;
  },

  // Update a log
  updateLog: async (id, updateData) => {
    const response = await api.put(`/logs/${id}`, updateData);
    return response.data;
  },

  // Delete a log
  deleteLog: async (id) => {
    const response = await api.delete(`/logs/${id}`);
    return response.data;
  },

  // Get exercise history
  getExerciseHistory: async (exerciseName, limit = 10) => {
    const response = await api.get(`/logs/exercise/${encodeURIComponent(exerciseName)}/history`, {
      params: { limit }
    });
    return response.data;
  },
};

// Dashboard API calls (Phase 2)
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get calendar data for a specific month
  getCalendar: async (year, month) => {
    const response = await api.get('/dashboard/calendar', {
      params: { year, month }
    });
    return response.data;
  },

  // Get progress data for an exercise
  getProgress: async (exerciseName, limit = 10) => {
    const response = await api.get('/dashboard/progress', {
      params: { exerciseName, limit }
    });
    return response.data;
  },
};

export default api;


// Schedule API calls (Routine Scheduling)
export const scheduleAPI = {
  // Schedule a routine for a specific date
  scheduleRoutine: async (routineId, date, notes = '') => {
    const response = await api.post('/schedule', { routineId, date, notes });
    return response.data;
  },

  // Get all scheduled routines (with optional filters)
  getScheduledRoutines: async (startDate, endDate, routineId) => {
    const response = await api.get('/schedule', {
      params: { startDate, endDate, routineId }
    });
    return response.data;
  },

  // Get scheduled routines for a specific month (calendar view)
  getCalendarSchedule: async (year, month) => {
    const response = await api.get(`/schedule/calendar/${year}/${month}`);
    return response.data;
  },

  // Get a specific scheduled routine
  getScheduledRoutine: async (id) => {
    const response = await api.get(`/schedule/${id}`);
    return response.data;
  },

  // Update a scheduled routine
  updateScheduledRoutine: async (id, updates) => {
    const response = await api.put(`/schedule/${id}`, updates);
    return response.data;
  },

  // Delete a scheduled routine
  deleteScheduledRoutine: async (id) => {
    const response = await api.delete(`/schedule/${id}`);
    return response.data;
  },
};
