// This is the actual code you would place in `pages/index.js`.
import { useState } from 'react';
import Header from '../components/Header';
import IdeaForm from '../components/IdeaForm';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';


export default function HomePage() {
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
      // NOTE: In Next.js, this fetch request works seamlessly.
      // We are calling the API route we defined earlier.
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setPosts(data.posts);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // In a real Next.js app, this is the default export of `pages/index.js`.
  // The JSX below uses the imported components.
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                Turn Your Idea Into Viral Posts
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-400">
                Just drop your concept below and let AI craft compelling posts for X, Facebook, Instagram, LinkedIn, TikTok, and more.
            </p>
        </div>

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
