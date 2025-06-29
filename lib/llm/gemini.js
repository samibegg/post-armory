export async function generateWithGemini(prompt, apiKey) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY", items: { type: "OBJECT", properties: { platform: { type: "STRING" }, content: { type: "STRING" }, hashtags: { type: "ARRAY", items: { type: "STRING" } } }, required: ["platform", "content", "hashtags"] }
            }
        }
    };
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Google Gemini API call failed with status ${response.status}: ${errorBody}`);
    }

    const result = await response.json();
    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error("Invalid response structure from Google Gemini API.");
    }
}