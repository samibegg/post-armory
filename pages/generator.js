// --- /pages/generator.js (PROTECTED PAGE) ---
import { useState } from 'react';
import { getSession as getGeneratorSession } from 'next-auth/react';
import HeaderGenerator from '../components/Header';
import IdeaForm from '../components/IdeaForm';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GeneratorPage() {
  const [idea, setIdea] = useState('');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPosts([]);
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
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
      <HeaderGenerator />
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
    const session = await getGeneratorSession(context);
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    return {
        props: { session },
    };
}

