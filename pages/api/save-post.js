// --- /pages/api/save-post.js (NEW) ---
// This new API route saves a post to MongoDB.
import clientPromise from '../../lib/mongodb'

export default async function savePost(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { platform, content, hashtags } = req.body;

    const client = await clientPromise;
    const db = client.db("social_media_posts"); // You can name your database whatever you like

    const postDocument = {
      platform,
      content,
      hashtags,
      postedAt: new Date(),
      status: 'saved', // You could expand this later (e.g., 'posted', 'scheduled')
    };

    const result = await db.collection("posts").insertOne(postDocument);

    res.status(201).json({ message: "Post saved successfully!", postId: result.insertedId });
  } catch (error) {
    console.error("Failed to save post to DB:", error);
    res.status(500).json({ message: "Failed to save post." });
  }
}

