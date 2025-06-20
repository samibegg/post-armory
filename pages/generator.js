// --- /pages/generator.js (UPDATED) ---
import { useState, useEffect } from 'react';
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth"; // Import shared config with new name
import Header from '../components/Header';
import IdeaForm from '../components/IdeaForm';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GeneratorPage() {
  const [idea, setIdea] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
          if (data.system_prompt) {
            setSystemPrompt(data.system_prompt);
          }
        })
        .catch(err => console.error("Could not fetch system prompt:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPosts([]);

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, system_prompt: systemPrompt }),
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
        <IdeaForm 
            idea={idea} 
            setIdea={setIdea} 
            handleSubmit={handleSubmit} 
            isLoading={isLoading} 
        />
        <div className="mt-16">
          {isLoading && <LoadingSpinner />}
          {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">Error: {error}</p>}
          {posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <PostCard key={index} post={post} />
              ))}
            </div>
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
