// --- /pages/poster.js (UPDATED) ---
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import SavedPostCard from '../components/SavedPostCard';

export default function PosterPage() {
    const [allPosts, setAllPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = useCallback(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                setAllPosts(data.posts);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch posts:", err);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);
    
    const { savedPosts, postedPosts } = useMemo(() => {
        const saved = allPosts.filter(p => p.status !== 'posted');
        const posted = allPosts.filter(p => p.status === 'posted');
        return { savedPosts: saved, postedPosts: posted };
    }, [allPosts]);

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the post.');
            }
            
            setAllPosts(currentPosts => currentPosts.filter(p => p._id !== postId));

        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />
            <main className="container mx-auto px-4 py-16">
                {isLoading ? (
                    <LoadingSpinner />
                ) : allPosts.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h1 className="text-3xl font-bold text-center mb-8">Saved Drafts</h1>
                            <div className="relative max-w-2xl mx-auto">
                                <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-700" aria-hidden="true"></div>
                                <div className="relative flex flex-col gap-12">
                                     {savedPosts.length > 0 ? savedPosts.map(post => (
                                        <div key={post._id} className="relative pl-12">
                                            <div className="absolute left-4 top-4 -ml-1 h-2 w-2 rounded-full bg-cyan-400"></div>
                                            <SavedPostCard post={post} onDelete={handleDeletePost} onPostSuccess={fetchPosts} />
                                        </div>
                                    )) : <p className="text-center text-slate-400 pl-8">No saved drafts.</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-center mb-8">Already Posted</h1>
                             <div className="relative max-w-2xl mx-auto">
                                <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-700" aria-hidden="true"></div>
                                <div className="relative flex flex-col gap-12">
                                     {postedPosts.length > 0 ? postedPosts.map(post => (
                                        <div key={post._id} className="relative pl-12">
                                            <div className="absolute left-4 top-4 -ml-1 h-2 w-2 rounded-full bg-green-400"></div>
                                            <SavedPostCard post={post} onDelete={handleDeletePost} onPostSuccess={fetchPosts} />
                                        </div>
                                    )) : <p className="text-center text-slate-400 pl-8">No posted content yet.</p>}
                                </div>
                            </div>
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
