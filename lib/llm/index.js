// --- /lib/llm/index.js (NEW) ---
import { generateWithGemini } from './gemini';
import { generateWithOpenAI } from './openai';
import { generateWithClaude } from './claude';

export async function generateContent(provider, prompt, apiKey) {
    try {
        let jsonString;
        switch (provider) {
            case 'openai':
                if (!apiKey) throw new Error('OpenAI API key is required.');
                jsonString = await generateWithOpenAI(prompt, apiKey);
                break;
            case 'claude':
                if (!apiKey) throw new Error('Anthropic API key is required.');
                jsonString = await generateWithClaude(prompt, apiKey);
                break;
            case 'gemini':
            default:
                if (!apiKey) throw new Error('Google Gemini API key is required.');
                jsonString = await generateWithGemini(prompt, apiKey);
                break;
        }
        // The final JSON parsing happens here to ensure consistency.
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(`Error generating content with ${provider}:`, error);
        // Re-throw a more user-friendly error
        throw new Error(`Failed to generate content using ${provider}. Please check your API key and try again. Original error: ${error.message}`);
    }
}

