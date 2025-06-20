// --- /pages/poster.js (UPDATED) ---
import { useState, useEffect } from 'react';
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import SavedPostCard from '../components/SavedPostCard';

export default function PosterPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data.posts);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch posts:", err);
                setIsLoading(false);
            });
    }, []);

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the post.');
            }
            
            // Remove the post from the local state to update the UI
            setPosts(currentPosts => currentPosts.filter(p => p._id !== postId));

        } catch (error) {
            console.error(error.message);
            // Optionally, show an error message to the user
        }
    };

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />
            <main className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-10">Your Saved Posts</h1>
                {isLoading ? (
                    <LoadingSpinner />
                ) : posts.length > 0 ? (
                    <div className="relative max-w-2xl mx-auto">
                        {/* The timeline line */}
                        <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-700" aria-hidden="true"></div>
                        
                        <div className="relative flex flex-col gap-12">
                             {posts.map(post => (
                                <div key={post._id} className="relative pl-12">
                                     {/* The timeline dot */}
                                    <div className="absolute left-4 top-4 -ml-1 h-2 w-2 rounded-full bg-cyan-400"></div>
                                    <SavedPostCard post={post} onDelete={handleDeletePost} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-slate-400">You have not saved any posts yet. Go to the generator to create some!</p>
                )}
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
    
    return {
        props: { session: JSON.parse(JSON.stringify(session)) },
    };
}

