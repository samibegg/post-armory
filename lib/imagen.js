// /lib/imagen.js (Updated for Vercel Deployment)

import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

// --- Vercel Production Logic ---
// This block of code will run only once when the serverless function starts.
// It creates a temporary credentials file from the environment variable.
if (process.env.VERCEL_ENV === 'production' && process.env.GOOGLE_CREDENTIALS_JSON) {
  const credentialsPath = path.join('/tmp', 'google-credentials.json');
  fs.writeFileSync(credentialsPath, process.env.GOOGLE_CREDENTIALS_JSON);
  // Set the environment variable that Google's library looks for
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  console.log('Vercel: Created temporary credentials file.');
}
// -----------------------------

export const generateImageWithImagen = async (prompt) => {
    try {
        console.log("Authenticating with Google...");
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
        });
        
        // This will now automatically find the credentials file we created above when on Vercel,
        // or use your local Application Default Credentials during development.
        const client = await auth.getClient();
        const accessToken = (await client.getAccessToken()).token;

        const project = process.env.GCP_PROJECT_ID;
        const location = process.env.GCP_LOCATION;
        
        const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/imagegeneration@006:predict`;
        
        const body = {
          instances: [ { "prompt": prompt } ],
          parameters: { "sampleCount": 1, "aspectRatio": "1:1" }
        };

        console.log("Requesting image generation via direct fetch...");
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message}`);
        }

        const data = await response.json();

        if (!data.predictions || data.predictions.length === 0) {
            throw new Error("API returned no predictions.");
        }
        
        const image = data.predictions[0].bytesBase64Encoded;
        if (!image) {
            throw new Error("Invalid image data in API response.");
        }

        return `data:image/png;base64,${image}`;

    } catch (error) {
        console.error('Error generating image (Fetch Method):', error);
        throw new Error(`Failed to generate image. Details: ${error.message}`);
    }
};