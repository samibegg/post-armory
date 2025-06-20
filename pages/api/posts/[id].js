// --- /pages/api/posts/[id].js (NEW) ---
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, nextAuthOptions);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;

    if (req.method === 'PUT') {
        try {
            const { content, hashtags } = req.body;
            const client = await clientPromise;
            const db = client.db("postarmory");
            const postsCollection = db.collection("posts");

            const result = await postsCollection.updateOne(
                { _id: new ObjectId(id), userId: session.user.id }, // Security check
                { $set: { content, hashtags } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Post not found or you do not have permission to edit it.' });
            }

            return res.status(200).json({ message: 'Post updated successfully.' });
        } catch (error) {
            console.error("Failed to update post:", error);
            return res.status(500).json({ message: 'Failed to update post.' });
        }
    }

    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}


