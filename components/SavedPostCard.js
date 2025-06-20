// --- /components/SavedPostCard.js (UPDATED) ---
import { useState, useEffect } from 'react';

export default function SavedPostCard({ post }) {
    const [content, setContent] = useState(post.content);
    const [tags, setTags] = useState(post.hashtags);
    const [saveStatus, setSaveStatus] = useState('Save Changes'); // Save Changes, Saving..., Saved!
    const [postStatus, setPostStatus] = useState('Post Now');

    // Reset local state if the post prop changes
    useEffect(() => {
        setContent(post.content);
        setTags(post.hashtags);
    }, [post]);

    const handleSave = async () => {
        setSaveStatus('Saving...');
        try {
            const response = await fetch(`/api/posts/${post._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, hashtags: tags }),
            });
            if (!response.ok) throw new Error('Failed to save changes.');
            setSaveStatus('Saved!');
            setTimeout(() => setSaveStatus('Save Changes'), 2000);
        } catch (error) {
            console.error(error);
            setSaveStatus('Error!');
            setTimeout(() => setSaveStatus('Save Changes'), 2000);
        }
    };
    
    const handlePost = async () => {
        setPostStatus('Posting...');
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setPostStatus('Posted!');
    };
    
    const removeTag = (indexToRemove) => {
        setTags(currentTags => currentTags.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="bg-slate-800/50 ring-1 ring-slate-700/50 rounded-xl shadow-lg flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-100">{post.platform}</h3>
                    <p className="text-xs text-slate-400">{new Date(post.postedAt).toLocaleString()}</p>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-300 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all h-40 resize-none"
                />
                <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag, index) => (
                        <span key={index} className="flex items-center px-3 py-1 bg-cyan-400/10 text-cyan-300 text-sm font-medium rounded-full">
                            {tag}
                            <button onClick={() => removeTag(index)} className="ml-2 -mr-1 text-cyan-200 hover:text-white text-lg leading-none">&times;</button>
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t border-slate-700/50 bg-slate-800/30 rounded-b-xl space-x-3">
                 <button 
                    onClick={handleSave} 
                    disabled={saveStatus !== 'Save Changes'} 
                    className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                    <span>{saveStatus}</span>
                </button>
                 <button 
                    onClick={handlePost} 
                    disabled={postStatus !== 'Post Now'} 
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                    <span>{postStatus}</span>
                </button>
            </div>
        </div>
    );
}
