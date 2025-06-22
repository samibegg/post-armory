import axios from 'axios';

// Check if all required environment variables are set.
if (!process.env.LINKEDIN_AUTHOR_URN || !process.env.LINKEDIN_ACCESS_TOKEN) {
    console.warn('Missing LinkedIn credentials in .env.local. LinkedIn posting will fail.');
}

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const AUTHOR_URN = process.env.LINKEDIN_AUTHOR_URN;
const API_URL = 'https://api.linkedin.com/v2/ugcPosts';

/**
 * Posts a message to a LinkedIn profile or page.
 * @param {object} params - The parameters for the post.
 * @param {string} params.text - The text content to post.
 * @returns {Promise<object>} - The response data from the LinkedIn API.
 */
export const postToLinkedIn = async ({ text }) => {
    if (!AUTHOR_URN || !ACCESS_TOKEN) {
        throw new Error('LinkedIn environment variables are not configured.');
    }

    const requestBody = {
        author: AUTHOR_URN,
        lifecycleState: 'PUBLISHED',
        specificContent: {
            'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                    text: text,
                },
                shareMediaCategory: 'NONE',
            },
        },
        visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
    };

    const config = {
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'X-Restli-Protocol-Version': '2.0.0', // Required by LinkedIn
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await axios.post(API_URL, requestBody, config);
        return response.data;
    } catch (error) {
        const errorDetails = error.response?.data || { message: error.message };
        console.error('LinkedIn API Error:', JSON.stringify(errorDetails, null, 2));
        throw new Error(`Failed to post to LinkedIn: ${errorDetails.message || 'Unknown error'}`);
    }
};