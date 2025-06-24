// --- /pages/generator.js (FINAL) ---
import { useState, useEffect, useMemo } from 'react';
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import Header from '../components/Header';
import IdeaForm from '../components/IdeaForm';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageGenerator from '../components/ImageGenerator'; // Ensure this is imported

export default function GeneratorPage() {
  const [idea, setIdea] = useState('');
  const [userSettings, setUserSettings] = useState({});
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          setUserSettings(data);
        })
        .catch(err => console.error("Could not fetch user settings:", err));
  }, []);

  const composedPrompt = useMemo(() => {
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

    return `${userContext}Based on the detailed context provided, generate 6 distinct social media posts for the following idea: "${idea}".

    Create one post for each platform: X, Snapchat, TikTok, LinkedIn, Facebook, and Instagram.

    For each post, provide:
    1.  A "platform".
    2.  A "content" body tailored to the platform's style: 
        - For X, keep total characters (including whitespaces) under 280. 
        - For LinkedIn, keep total words 200-250
        - For Facebook, keep 40–80 characters with a clear CTA.   
        - For TikTok/Snapchat, suggest a visual idea/script.
    3.  Include hashtags.

    Return the result as a JSON array.`;
  }, [idea, userSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPosts([]);

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, userSettings }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong');
      setPosts(data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
            <IdeaForm
                idea={idea}
                setIdea={setIdea}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                rows={8}
            />

            <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Live Prompt Preview</h3>
                <p className="text-xs text-slate-400 mb-2">This is the complete prompt, including your settings, that will be sent to the AI.</p>
                <textarea
                    value={composedPrompt}
                    readOnly
                    rows={15}
                    className="w-full p-4 bg-slate-900/50 ring-1 ring-slate-700 rounded-lg text-slate-400 text-xs font-mono"
                />
            </div>
        </div>

        <div className="mt-16">
          {isLoading && <LoadingSpinner />}
          {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">Error: {error}</p>}
          {posts.length > 0 && (
            <>
              {/* --- POST CARDS SECTION --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <PostCard key={index} post={post} />
                ))}
              </div>

              {/* --- IMAGE GENERATOR SECTION (NEW) --- */}
              <div className="mt-16 pt-10 border-t border-slate-700/50">
                  <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Generate a Supporting Image</h2>
                    <p className="mt-2 text-lg leading-8 text-slate-400">
                        Create a unique, high-quality image based on your original idea to accompany your social media posts.
                    </p>
                  </div>
                  {/* Pass the original 'idea' as the initial prompt */}
                  <ImageGenerator initialPrompt={idea} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, nextAuthOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const sanitizedSession = JSON.parse(JSON.stringify(session));

    return {
        props: { session: sanitizedSession },
    };
}