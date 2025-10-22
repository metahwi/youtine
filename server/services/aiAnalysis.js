const { YoutubeTranscript } = require('youtube-transcript');
const OpenAI = require('openai');
const Video = require('../models/Video');
const { createLogger } = require('../utils/logger');

const logger = createLogger('aiAnalysis');

/**
 * AI Analysis Service
 * Handles video transcript fetching and LLM-based exercise detection
 */

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

/**
 * Extract video ID from YouTube URL
 */
function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Fetch transcript from YouTube video
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<string>} - Full transcript text with timestamps
 */
async function fetchTranscript(videoId) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    
    if (!transcript || transcript.length === 0) {
      throw new Error('No transcript available for this video');
    }
    
    // Format transcript with timestamps
    const formattedTranscript = transcript.map(item => {
      const timestamp = Math.floor(item.offset / 1000); // Convert to seconds
      return `[${timestamp}s] ${item.text}`;
    }).join('\n');
    
    logger.success(`Fetched transcript for video ${videoId}: ${transcript.length} segments`);
    return formattedTranscript;
  } catch (error) {
    logger.error(`Error fetching transcript for ${videoId}:`, error.message);
    throw new Error(`Failed to fetch transcript: ${error.message}`);
  }
}

/**
 * Analyze transcript using LLM to detect exercises
 * @param {string} transcript - Video transcript with timestamps
 * @param {string} videoTitle - Video title for context
 * @returns {Promise<Array>} - Array of exercise segments
 */
async function analyzeWithLLM(transcript, videoTitle) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `You are analyzing a workout video transcript to identify exercises.

Video Title: ${videoTitle}

Transcript (with timestamps):
${transcript.substring(0, 3000)} ${transcript.length > 3000 ? '...(truncated)' : ''}

Extract all exercises mentioned in this workout video. For each exercise:
1. Exercise name (standardized, e.g., "Push-ups", "Squats", "Bench Press")
2. Timestamp in seconds when the exercise starts
3. Target muscle groups (e.g., ["Chest", "Triceps"])

Return ONLY a JSON array in this exact format:
[
  {
    "exerciseName": "Push-ups",
    "timestamp": 45,
    "targetMuscles": ["Chest", "Triceps", "Shoulders"]
  }
]

If no exercises are found, return an empty array: []`;

  try {
    logger.info('Sending transcript to LLM for analysis...');

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are a fitness expert who analyzes workout videos." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content.trim();
    logger.success('LLM analysis complete');

    // Parse JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      logger.error('No valid JSON found in LLM response');
      return [];
    }

    const exercises = JSON.parse(jsonMatch[0]);
    logger.info(`Detected ${exercises.length} exercises`);
    return exercises;

  } catch (error) {
    logger.error('Error analyzing with LLM:', error.message);
    throw error;
  }
}

/**
 * Main analysis function
 * @param {string} videoId - MongoDB video document ID
 */
async function analyzeVideo(videoId) {
  logger.info(`Starting AI analysis for video ${videoId}`);

  try {
    // Get video from database
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    // Extract YouTube video ID
    const youtubeId = extractVideoId(video.url);
    if (!youtubeId) {
      throw new Error('Invalid YouTube URL');
    }

    // Step 1: Fetch transcript
    logger.info('Fetching transcript...');
    const transcript = await fetchTranscript(youtubeId);

    // Step 2: Check if OpenAI is configured
    if (!openai) {
      logger.warn('OpenAI API key not configured, skipping AI analysis');
      await Video.findByIdAndUpdate(videoId, {
        status: 'completed',
        segments: [],
        analysisError: 'OpenAI API key not configured. Add OPENAI_API_KEY to .env file.'
      });
      return;
    }

    // Step 3: Analyze with LLM
    logger.info('Analyzing with AI...');
    const exercises = await analyzeWithLLM(transcript, video.title);

    // Step 4: Update video with results
    await Video.findByIdAndUpdate(videoId, {
      status: 'completed',
      segments: exercises,
      analysisError: null
    });

    logger.success(`Analysis complete! Found ${exercises.length} exercises`);

  } catch (error) {
    logger.error(`Analysis failed for video ${videoId}:`, error.message);
    
    // Update video with error status
    await Video.findByIdAndUpdate(videoId, {
      status: 'failed',
      segments: [],
      analysisError: error.message
    });
  }
}

/**
 * Analyze video with timeout
 * @param {string} videoId - MongoDB video document ID
 * @param {number} timeout - Timeout in milliseconds (default: 60000 = 1 minute)
 */
async function analyzeVideoWithTimeout(videoId, timeout = 60000) {
  return Promise.race([
    analyzeVideo(videoId),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Analysis timeout after 60 seconds')), timeout)
    )
  ]).catch(async (error) => {
    logger.error(`Analysis timeout or error for video ${videoId}`);
    await Video.findByIdAndUpdate(videoId, {
      status: 'failed',
      segments: [],
      analysisError: 'Analysis timeout. Video may be too long or transcript unavailable.'
    });
  });
}

module.exports = {
  analyzeVideo: analyzeVideoWithTimeout,
  extractVideoId
};

