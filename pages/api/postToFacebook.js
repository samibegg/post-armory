import { postToFacebook } from '@/lib/facebook';
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth"; // Assuming same auth options

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

  // Validate the post text
  if (!postText || postText.trim() === '') {
    return res.status(400).json({ error: 'Post text cannot be empty.' });
  }

  // Facebook's limit is much larger, so a simple check is enough.
  // The actual limit is 63,206 characters.
  if (postText.length > 60000) {
    return res.status(400).json({ error: `Post is too long for Facebook.` });
  }

  try {
    // Use the imported function to post to Facebook
    const facebookResponse = await postToFacebook({ text: postText });
    
    // Send a success response back to the client
    return res.status(200).json({
      message: 'Posted to Facebook successfully!',
      post: facebookResponse,
    });
  } catch (error) {
    console.error('Error posting to Facebook:', error);
    
    // Send an error response back to the client
    return res.status(500).json({ 
        error: 'An error occurred while posting to Facebook.',
        details: error.message || 'Unknown error'
    });
  }
}
