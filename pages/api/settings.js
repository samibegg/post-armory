// --- /pages/api/settings.js ---
import { getServerSession } from "next-auth/next"
import { nextAuthOptions } from "@/lib/auth"
import clientPromiseSettings from '@/lib/mongodb';
import { encrypt, decrypt } from '@/lib/crypto';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, nextAuthOptions);
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const client = await clientPromiseSettings;
    const db = client.db("postarmory");
    const settingsCollection = db.collection('user_settings');
    const userId = session.user.id;

    if (req.method === 'POST') {
        const {
            business_name, address, phone, email, system_prompt,
            include_business_name, include_address, include_phone, include_email,
            x_api_key, facebook_token, instagram_token, linkedin_token, tiktok_token, snapchat_token,
            x_url, facebook_url, instagram_url, linkedin_url, tiktok_url, snapchat_url, website_url
        } = req.body;

        const settingsUpdate = {
            business_name, address, phone, email, system_prompt,
            include_business_name, include_address, include_phone, include_email,
            x_url, facebook_url, instagram_url, linkedin_url, tiktok_url, snapchat_url, website_url
        };
        
        // Encrypt all tokens/keys
        if (x_api_key) settingsUpdate.x_api_key = encrypt(x_api_key);
        if (facebook_token) settingsUpdate.facebook_token = encrypt(facebook_token);
        if (instagram_token) settingsUpdate.instagram_token = encrypt(instagram_token);
        if (linkedin_token) settingsUpdate.linkedin_token = encrypt(linkedin_token);
        if (tiktok_token) settingsUpdate.tiktok_token = encrypt(tiktok_token);
        if (snapchat_token) settingsUpdate.snapchat_token = encrypt(snapchat_token);

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
            business_name: settings?.business_name || '',
            address: settings?.address || '',
            phone: settings?.phone || '',
            email: settings?.email || '',
            system_prompt: settings?.system_prompt || '',
            include_business_name: settings?.include_business_name || false,
            include_address: settings?.include_address || false,
            include_phone: settings?.include_phone || false,
            include_email: settings?.include_email || false,
            x_url: settings?.x_url || '',
            facebook_url: settings?.facebook_url || '',
            instagram_url: settings?.instagram_url || '',
            linkedin_url: settings?.linkedin_url || '',
            tiktok_url: settings?.tiktok_url || '',
            snapchat_url: settings?.snapchat_url || '',
            website_url: settings?.website_url || ''
        };

        // Decrypt all tokens/keys
        if (settings?.x_api_key) decryptedSettings.x_api_key = decrypt(settings.x_api_key);
        if (settings?.facebook_token) decryptedSettings.facebook_token = decrypt(settings.facebook_token);
        if (settings?.instagram_token) decryptedSettings.instagram_token = decrypt(settings.instagram_token);
        if (settings?.linkedin_token) decryptedSettings.linkedin_token = decrypt(settings.linkedin_token);
        if (settings?.tiktok_token) decryptedSettings.tiktok_token = decrypt(settings.tiktok_token);
        if (settings?.snapchat_token) decryptedSettings.snapchat_token = decrypt(settings.snapchat_token);
        
        return res.status(200).json(decryptedSettings);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

