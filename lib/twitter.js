// --- /lib/twitter.js (NEW) ---
import { TwitterApi } from 'twitter-api-v2';

// Check if all required environment variables are set.
if (!process.env.X_API_KEY ||
    !process.env.X_API_SECRET ||
    !process.env.X_ACCESS_TOKEN ||
    !process.env.X_ACCESS_TOKEN_SECRET) {
    console.warn('Missing Twitter API credentials in .env.local. Twitter posting will fail.');
}

// Initialize the client with your app's credentials.
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

// Instantiate a read-write client.
// This is what you'll use to post tweets.
export const rwClient = client.readWrite;
