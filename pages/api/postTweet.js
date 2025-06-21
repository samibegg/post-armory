// --- /pages/api/postTweet.js (UPDATED) ---
import { rwClient } from '@/lib/twitter';
import { getServerSession } from "next-auth/next";
import { nextAuthOptions as postTweetAuthOptions } from "@/lib/auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, postTweetAuthOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Only allow POST requests to this endpoint.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Get the tweet text from the request body.
  const { tweetText } = req.body;

  // Validate the tweet text.
  if (!tweetText || tweetText.trim() === '') {
    return res.status(400).json({ error: 'Tweet text cannot be empty.' });
  }
  if (tweetText.length > 280) {
    return res.status(400).json({ error: `Tweet text cannot exceed 280 characters. Current length: ${tweetText.length}` });
  }

  try {
    // Use the imported client to post the tweet.
    const { data: createdTweet } = await rwClient.v2.tweet(tweetText);
    
    // Send a success response back to the client.
    return res.status(200).json({
      message: 'Tweet posted successfully!',
      tweet: createdTweet,
    });
  } catch (error) {
    console.error('Error posting tweet:', error);
    
    // Send an error response back to the client.
    return res.status(500).json({ 
        error: 'An error occurred while posting the tweet.',
        details: error.message || 'Unknown error'
    });
  }
}

