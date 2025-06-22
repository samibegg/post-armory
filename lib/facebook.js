import axios from 'axios';

// Check if all required environment variables are set.
if (!process.env.FACEBOOK_PAGE_ID || !process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
    console.warn('Missing Facebook credentials in .env.local. Facebook posting will fail.');
}

const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

// The base URL for the Facebook Graph API.
// Using a specific version (e.g., v20.0) is recommended for stability.
const BASE_URL = `https://graph.facebook.com/v20.0`;

/**
 * Posts a message to a Facebook Page.
 * @param {object} params - The parameters for the post.
 * @param {string} params.text - The text content to post.
 * @returns {Promise<object>} - The response data from the Facebook API.
 */
export const postToFacebook = async ({ text }) => {
    if (!PAGE_ID || !ACCESS_TOKEN) {
        throw new Error('Facebook environment variables are not configured.');
    }

    const endpoint = `${BASE_URL}/${PAGE_ID}/feed`;

    try {
        const response = await axios.post(endpoint, {
            message: text,
            access_token: ACCESS_TOKEN,
        });
        return response.data;
    } catch (error) {
        // Log a more helpful error message from Facebook's response
        const errorDetails = error.response?.data?.error || { message: error.message };
        console.error('Facebook API Error:', JSON.stringify(errorDetails, null, 2));
        throw new Error(`Failed to post to Facebook: ${errorDetails.message}`);
    }
};
