// --- /pages/api/settings.js ---
import { getSession } from 'next-auth/react';
import clientPromiseSettings from '../../lib/mongodb';
import { encrypt, decrypt } from '../../lib/crypto';

export async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const client = await clientPromiseSettings;
    const db = client.db("social_media_posts");
    const settingsCollection = db.collection('user_settings');
    const userId = session.user.id;
    if (req.method === 'POST') {
        const { x_api_key, facebook_token } = req.body;
        const encryptedSettings = {};
        if (x_api_key) encryptedSettings.x_api_key = encrypt(x_api_key);
        if (facebook_token) encryptedSettings.facebook_token = encrypt(facebook_token);
        await settingsCollection.updateOne(
            { userId },
            { $set: encryptedSettings },
            { upsert: true }
        );
        return res.status(200).json({ message: 'Settings saved successfully.' });
    }
    if (req.method === 'GET') {
        const settings = await settingsCollection.findOne({ userId });
        const decryptedSettings = {};
        if (settings?.x_api_key) decryptedSettings.x_api_key = decrypt(settings.x_api_key);
        if (settings?.facebook_token) decryptedSettings.facebook_token = decrypt(settings.facebook_token);
        return res.status(200).json(decryptedSettings);
    }
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
