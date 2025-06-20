// --- /pages/api/settings.js (UPDATED) ---
import { getServerSession } from "next-auth/next"
import clientPromiseSettings from '@/lib/mongodb';
import { encrypt, decrypt } from '@/lib/crypto';
import { nextAuthOptions } from "@/lib/auth" // Import shared config with new name

export default async function handler(req, res) {
    const session = await getServerSession(req, res, nextAuthOptions); // Use getServerSession
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const client = await clientPromiseSettings;
    const db = client.db("postarmory");
    const settingsCollection = db.collection('user_settings');
    const userId = session.user.id;

    if (req.method === 'POST') {
        const { x_api_key, facebook_token, system_prompt } = req.body;
        
        const settingsUpdate = { system_prompt };
        if (x_api_key) settingsUpdate.x_api_key = encrypt(x_api_key);
        if (facebook_token) settingsUpdate.facebook_token = encrypt(facebook_token);
        
        await settingsCollection.updateOne(
            { userId },
            { $set: settingsUpdate },
            { upsert: true }
        );
        
        return res.status(200).json({ message: 'Settings saved successfully.' });
    }

    if (req.method === 'GET') {
        const settings = await settingsCollection.findOne({ userId });
        
        const decryptedSettings = {
            system_prompt: settings?.system_prompt || ''
        };
        if (settings?.x_api_key) decryptedSettings.x_api_key = decrypt(settings.x_api_key);
        if (settings?.facebook_token) decryptedSettings.facebook_token = decrypt(settings.facebook_token);
        
        return res.status(200).json(decryptedSettings);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
