// --- /pages/api/generate-post.js (UPDATED) ---
import { getServerSession } from "next-auth/next"
import { nextAuthOptions } from "@/lib/auth" // Import shared config with new name

export default async function generatePostAPI(req, res) {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  
  const { idea, system_prompt } = req.body;

  if (!idea) {
    return res.status(400).json({ message: 'Idea is required' });
  }

  try {
    const userContext = system_prompt 
      ? `Here is some context about the user and their brand:\n---\n${system_prompt}\n---\n\n`
      : "";

    const finalPrompt = `${userContext}Based on the context (if provided), generate 6 distinct social media posts for the following idea: "${idea}". 
    
    Create one post for each of these platforms: X (formerly Twitter), Snapchat, TikTok, LinkedIn, Facebook, and Instagram.

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


