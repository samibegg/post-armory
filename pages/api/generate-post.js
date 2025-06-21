// --- /pages/api/generate-post.js ---
import { getServerSession } from "next-auth/next"
import { nextAuthOptions as generatePostAuthOptions } from "@/lib/auth" 

export default async function generatePostAPI(req, res) {
  const session = await getServerSession(req, res, generatePostAuthOptions);
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
    let userContext = "Here is some context about the user, their brand, and their goals. Use this to tailor the generated posts:\n";
    if (userSettings?.system_prompt) {
        userContext += `\n**Overall Voice, Tone, and Instructions:**\n${userSettings.system_prompt}\n`;
    }
    if (userSettings?.include_business_name && userSettings.business_name) userContext += `\n- Business Name: ${userSettings.business_name}`;
    if (userSettings?.include_email && userSettings.email) userContext += `\n- Contact Email: ${userSettings.email}`;
    if (userSettings?.include_phone && userSettings.phone) userContext += `\n- Contact Phone: ${userSettings.phone}`;
    if (userSettings?.include_address && userSettings.address) userContext += `\n- Business Address: ${userSettings.address}`;
    if (userSettings?.website_url) userContext += `\n- Main Website: ${userSettings.website_url}`;
    if (userSettings?.snapchat_url) userContext += `\n- Snapchat: ${userSettings.snapchat_url}`;
    userContext += "\n---\n\n";
    
    const finalPrompt = `${userContext}Based on the detailed context provided, generate 6 distinct social media posts for the following idea: "${idea}". 
    
    Create one post for each platform: X, Snapchat, TikTok, LinkedIn, Facebook, and Instagram.

    For each post, provide:
    1.  A "platform".
    2.  A "content" body tailored to the platform's style. For TikTok/Snapchat, suggest a visual idea/script.
    3.  A list of relevant "hashtags".

    Return the result as a JSON array.`;

    const payload = {
        contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY", items: { type: "OBJECT", properties: { platform: { type: "STRING" }, content: { type: "STRING" }, hashtags: { type: "ARRAY", items: { type: "STRING" } } }, required: ["platform", "content", "hashtags"] }
            }
        }
    };
    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const apiResponse = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!apiResponse.ok) throw new Error(`API call failed with status: ${apiResponse.status}`);
    const result = await apiResponse.json();
    if (result.candidates?.[0]?.content?.parts?.[0]) {
      const jsonText = result.candidates[0].content.parts[0].text;
      res.status(200).json({ posts: JSON.parse(jsonText) });
    } else {
      throw new Error("Failed to generate content from API.");
    }

  } catch (error) {
    res.status(500).json({ message: 'Failed to generate post.', error: error.message });
  }
}
