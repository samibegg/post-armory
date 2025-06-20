// This content would be in `pages/api/generate-post.js`.
export default async function generatePostAPI(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ message: 'Idea is required' });
  }

  try {
    const prompt = `Generate 6 distinct social media posts based on this idea: "${idea}". 
    
    Create one post for each of the following platforms: X (formerly Twitter), Snapchat, TikTok, LinkedIn, Facebook, and Instagram.

    For each post, provide:
    1.  A "platform" (e.g., "X", "Snapchat", "TikTok", "LinkedIn", "Facebook", "Instagram").
    2.  A "content" body for the post, tailored to the specific platform's style and audience. For TikTok and Snapchat, suggest a visual idea or script.
    3.  A list of relevant "hashtags".

    Return the result as a JSON array.`;

    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = {
        contents: chatHistory,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        "platform": { "type": "STRING" },
                        "content": { "type": "STRING" },
                        "hashtags": {
                            "type": "ARRAY",
                            "items": { "type": "STRING" }
                        }
                    },
                    required: ["platform", "content", "hashtags"]
                }
            }
        }
    };
    const apiKey = process.env.GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API call failed with status: ${apiResponse.status}`);
    }

    const result = await apiResponse.json();
    
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const jsonText = result.candidates[0].content.parts[0].text;
      const generatedPosts = JSON.parse(jsonText);
      res.status(200).json({ posts: generatedPosts });
    } else {
        console.error("Unexpected API response structure:", result);
        if(result.promptFeedback && result.promptFeedback.blockReason){
           throw new Error(`Content blocked by API: ${result.promptFeedback.blockReason}`);
        }
        throw new Error("Failed to generate content from API.");
    }

  } catch (error) {
    console.error('Error generating post:', error);
    res.status(500).json({ message: 'Failed to generate post.', error: error.message });
  }
}

