// --- /pages/api/generate-post.js (UPDATED) ---
import { getServerSession } from "next-auth/next"
import { nextAuthOptions } from "@/lib/auth"
import clientPromise from '@/lib/mongodb';
import { decrypt } from '@/lib/crypto';
import { generateContent } from '@/lib/llm';

export default async function generatePostAPI(req, res) {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { idea, userSettings } = req.body;

  if (!idea) {
    return res.status(400).json({ message: 'Idea is required' });
  }

  try {
    const provider = userSettings?.llm_provider || 'gemini';
    let apiKey;

    // Get the correct API key based on the selected provider
    switch (provider) {
        case 'openai':
            apiKey = userSettings.openai_api_key;
            break;
        case 'claude':
            apiKey = userSettings.anthropic_api_key;
            break;
        case 'gemini':
        default:
            apiKey = userSettings.gemini_api_key || process.env.GEMINI_API_KEY; // Fallback to env var
            break;
    }

    if (!apiKey) {
        return res.status(400).json({ message: `API key for ${provider} not found in your settings.` });
    }

    let userContext = "Here is some context about the user, their brand, and their goals. Use this to tailor the generated posts:\n";
    if (userSettings?.system_prompt) userContext += `\n**Overall Voice, Tone, and Instructions:**\n${userSettings.system_prompt}\n`;
    if (userSettings?.include_business_name && userSettings.business_name) userContext += `\n- Business Name: ${userSettings.business_name}`;
    if (userSettings?.include_email && userSettings.email) userContext += `\n- Contact Email: ${userSettings.email}`;
    if (userSettings?.include_phone && userSettings.phone) userContext += `\n- Contact Phone: ${userSettings.phone}`;
    if (userSettings?.include_address && userSettings.address) userContext += `\n- Business Address: ${userSettings.address}`;
    if (userSettings?.website_url) userContext += `\n- Main Website: ${userSettings.website_url}`;
    if (userSettings?.snapchat_url) userContext += `\n- Snapchat: ${userSettings.snapchat_url}`;
    userContext += "\n---\n\n";
    
    const finalPrompt = `${userContext}Based on the detailed context provided, generate 6 distinct social media posts for the following idea: "${idea}". Create one post for each platform: X (formerly Twitter), Snapchat, TikTok, LinkedIn, Facebook, and Instagram. For each post, provide: "platform", "content", and "hashtags". Return the result as a single, valid JSON array of objects.`;

    const generatedPosts = await generateContent(provider, finalPrompt, apiKey);

    res.status(200).json({ posts: generatedPosts });

  } catch (error) {
    res.status(500).json({ message: 'Failed to generate post.', error: error.message });
  }
}
