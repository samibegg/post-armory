// --- /components/PostCard.js (UPDATED) ---
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Twitter, Facebook, Instagram, Linkedin, MessageSquare, ExternalLink, PilcrowSquare } from 'lucide-react';

const platformIcons = {
    'X': <Twitter className="w-5 h-5" />,
    'Twitter': <Twitter className="w-5 h-5" />,
    'Facebook': <Facebook className="w-5 h-5" />,
    'Instagram': <Instagram className="w-5 h-5" />,
    'LinkedIn': <Linkedin className="w-5 h-5" />,
    'TikTok': <MessageSquare className="w-5 h-5" />, 
    'Snapchat': <PilcrowSquare className="w-5 h-5" />, 
    'default': <ExternalLink className="w-5 h-5" />
};

export default function PostCard({ post }) {
    const { data: session } = useSession();
    const [content, setContent] = useState(post.content);
    const [tags, setTags] = useState(post.hashtags);
    const [saveStatus, setSaveStatus] = useState('Save to Drafts');

    useEffect(() => {
        setContent(post.content);
        setTags(post.hashtags || []);
        setSaveStatus('Save to Drafts');
    }, [post]);

    const handleSave = async () => {
        if (!session) return;
        setSaveStatus('Saving...');
        try {
            const updatedPost = { ...post, content, hashtags: tags };
            const response = await fetch('/api/save-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPost)
            });
            if (!response.ok) throw new Error('Failed to save post');
            setSaveStatus('Saved!');
        } catch (error) {
            console.error(error);
            setSaveStatus('Error!');
            setTimeout(() => setSaveStatus('Save to Drafts'), 2000);
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const platformIcon = platformIcons[post.platform] || platformIcons['default'];

    return (
        <div className="bg-slate-800/50 ring-1 ring-slate-700/50 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-cyan-400/10 hover:-translate-y-1">
            <div className="p-6 flex-grow">
                 <div className="flex items-center space-x-3 mb-4">
                    <span className="text-cyan-400">{platformIcon}</span>
                    <h3 className="text-xl font-bold text-slate-100">{post.platform}</h3>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-300 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all h-40 resize"
                />
                <div className="text-right text-xs text-slate-400 mt-1">
                    {content.length} characters
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {(tags || []).map((tag, index) => (
                        <span key={index} className="flex items-center px-3 py-1 bg-cyan-400/10 text-cyan-300 text-sm font-medium rounded-full">
                            {tag}
                            <button onClick={() => removeTag(index)} className="ml-2 -mr-1 text-cyan-200 hover:text-white text-lg leading-none">&times;</button>
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t border-slate-700/50 bg-slate-800/30 rounded-b-xl">
                <button 
                    onClick={handleSave} 
                    disabled={!session || saveStatus !== 'Save to Drafts'} 
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-600"
                    title={!session ? "Please sign in to save" : ""}
                >
                    <span>{saveStatus}</span>
                </button>
            </div>
        </div>
    );
}

