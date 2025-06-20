// --- /pages/api/posts/[id].js (UPDATED) ---
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
            const { content, hashtags, status } = req.body;
            const client = await clientPromise;
            const db = client.db("postarmory");
            const postsCollection = db.collection("posts");

            let updateData = {};

            // Differentiate between a content update and a status update
            if (status) {
                // This is a status update (e.g., after posting)
                if (status === 'posted') {
                    updateData.status = 'posted';
                    updateData.postedAt = new Date();
                }
            } else {
                // This is a content/hashtag update from "Save Changes"
                // Use hasOwnProperty to check for presence, allowing empty strings/arrays
                if (req.body.hasOwnProperty('content')) {
                    updateData.content = content;
                }
                if (req.body.hasOwnProperty('hashtags')) {
                    updateData.hashtags = hashtags;
                }
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "No valid update data provided." });
            }

            const result = await postsCollection.updateOne(
                { _id: new ObjectId(id), userId: session.user.id },
                { $set: updateData }
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

    if (req.method === 'DELETE') {
        try {
            const client = await clientPromise;
            const db = client.db("postarmory");
            const postsCollection = db.collection("posts");
            
            const result = await postsCollection.deleteOne({
                 _id: new ObjectId(id), userId: session.user.id 
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Post not found or you do not have permission to delete it.' });
            }
            
            return res.status(200).json({ message: 'Post deleted successfully.' });

        } catch (error) {
            console.error("Failed to delete post:", error);
            return res.status(500).json({ message: 'Failed to delete post.' });
        }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

