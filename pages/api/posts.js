// --- /pages/api/posts.js (NEW) ---
import { getServerSession } from "next-auth/next"
import { nextAuthOptions } from "@/lib/auth"
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, nextAuthOptions);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
    try {
        const client = await clientPromise;
        const db = client.db("postarmory");
        const postsCollection = db.collection("posts");

        const posts = await postsCollection.find({ userId: session.user.id }).sort({ postedAt: -1 }).toArray();

        res.status(200).json({ posts });
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        res.status(500).json({ message: 'Failed to fetch posts.' });
    }
}

