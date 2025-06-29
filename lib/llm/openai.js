// --- /lib/llm/openai.js (NEW) ---
import OpenAI from 'openai';

export async function generateWithOpenAI(prompt, apiKey) {
    const openai = new OpenAI({ apiKey });
    
    // Note: OpenAI's JSON mode is powerful but requires specific model versions (e.g., gpt-4-1106-preview)
    // and setting response_format to { "type": "json_object" }.
    // For broader compatibility, this example will parse a JSON string from the response.
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a social media post generator. Your response must be a valid JSON array of objects, where each object has 'platform', 'content', and 'hashtags' keys. Do not include any text outside of the JSON array.",
            },
            { role: "user", content: prompt }
        ],
    });

    const content = response.choices[0].message.content;
    // Basic cleanup in case the model adds markdown formatting
    return content.replace(/```json\n|```/g, '').trim();
}
