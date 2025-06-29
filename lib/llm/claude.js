// --- /lib/llm/claude.js (NEW) ---
import Anthropic from '@anthropic-ai/sdk';

export async function generateWithClaude(prompt, apiKey) {
    const anthropic = new Anthropic({ apiKey });

    // Anthropic's API is great at following structured instructions.
    const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514", // Or another suitable model
        max_tokens: 2048,
        messages: [
            {
                role: "user",
                content: `${prompt}\n\nPlease provide the response as a single, valid JSON array of objects. Do not include any introductory text or code block formatting.`,
            },
        ],
    });

    return response.content[0].text;
}
