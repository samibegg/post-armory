// --- /pages/poster.js ---
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

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />
            <main className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-10">Your Saved Posts</h1>
                {isLoading ? (
                    <LoadingSpinner />
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <SavedPostCard key={post._id} post={post} />
                        ))}
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

