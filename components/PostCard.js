// --- /components/PostCard.js (UPDATED) ---
import { useState } from 'react';

export default function PostCard({ post }) {
    const [copyStatus, setCopyStatus] = useState('Copy'); // Copy, Copied!
    const [postStatus, setPostStatus] = useState('Post'); // Post, Posting..., Posted!

    const copyToClipboard = () => {
        const textToCopy = `${post.content}\n\n${post.hashtags.join(' ')}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy'), 2000);
        }).catch(err => console.error('Failed to copy: ', err));
    };

    const handlePost = async () => {
        setPostStatus('Posting...');
        try {
            const response = await fetch('/api/save-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post)
            });
            if (!response.ok) throw new Error('Failed to save post');
            setPostStatus('Posted!');
        } catch (error) {
            console.error(error);
            setPostStatus('Error');
            setTimeout(() => setPostStatus('Post'), 2000);
        }
    };

    return (
        <div className="bg-slate-800/50 ring-1 ring-slate-700/50 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-400/10 hover:-translate-y-1">
            <div className="p-6">
                <h3 className="text-xl font-bold text-slate-100 mb-4">{post.platform}</h3>
                <p className="text-slate-300 mb-6 whitespace-pre-wrap min-h-[100px]">{post.content}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.hashtags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-cyan-400/10 text-cyan-300 text-sm font-medium rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700/50">
                    <button onClick={copyToClipboard} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50">
                        <span>{copyStatus}</span>
                    </button>
                    <button onClick={handlePost} disabled={postStatus !== 'Post'} className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:bg-slate-600">
                        <span>{postStatus}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

