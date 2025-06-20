// --- /pages/api/save-post.js (UPDATED) ---
import { getServerSession } from "next-auth/next"
import clientPromiseSavePost from '@/lib/mongodb';
import { nextAuthOptions } from "@/lib/auth" // Import shared config with new name

export default async function savePost(req, res) {
    const session = await getServerSession(req, res, nextAuthOptions); // Use getServerSession
    if (!session) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
    try {
      const { platform, content, hashtags } = req.body;
      const client = await clientPromiseSavePost;
      const db = client.db("postarmory");
      const postDocument = {
        userId: session.user.id,
        platform,
        content,
        hashtags,
        postedAt: new Date(),
        status: 'saved',
      };
      const result = await db.collection("posts").insertOne(postDocument);
      res.status(201).json({ message: "Post saved successfully!", postId: result.insertedId });
    } catch (error) {
      console.error("Failed to save post to DB:", error);
      res.status(500).json({ message: "Failed to save post." });
    }
}
