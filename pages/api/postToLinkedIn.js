import { postToLinkedIn } from '@/lib/linkedin';
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  // Get the post text from the request body
  const { postText } = req.body;

  if (!postText || postText.trim() === '') {
    return res.status(400).json({ error: 'Post text cannot be empty.' });
  }

  // LinkedIn's text limit for posts is 3000 characters.
  if (postText.length > 3000) {
    return res.status(400).json({ 
        error: `Post text cannot exceed 3000 characters. Current length: ${postText.length}` 
    });
  }

  try {
    const linkedInResponse = await postToLinkedIn({ text: postText });
    
    return res.status(200).json({
      message: 'Posted to LinkedIn successfully!',
      post: linkedInResponse,
    });
  } catch (error) {
    console.error('Error posting to LinkedIn:', error);
    
    return res.status(500).json({ 
        error: 'An error occurred while posting to LinkedIn.',
        details: error.message || 'Unknown error'
    });
  }
}
