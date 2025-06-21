// --- /components/SavedPostCard.js (UPDATED) ---
import { useState, useEffect } from 'react';
import { Twitter, Facebook, Instagram, Linkedin, MessageSquare, ExternalLink, Trash2, PilcrowSquare } from 'lucide-react';

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

export default function SavedPostCard({ post, onDelete, onPostSuccess }) {
    const [content, setContent] = useState(post.content);
    const [tags, setTags] = useState(post.hashtags || []); // Ensure tags is always an array
    const [status, setStatus] = useState(post.status);
    
    const [saveStatus, setSaveStatus] = useState('Save Changes');
    const [postStatus, setPostStatus] = useState('Post Now');
    const [isDeleting, setIsDeleting] = useState(false);
    const [postError, setPostError] = useState('');

    useEffect(() => {
        setContent(post.content);
        setTags(post.hashtags || []); // Ensure tags is always an array
        setStatus(post.status);
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
    
    const updateStatusToPosted = async () => {
        try {
            const response = await fetch(`/api/posts/${post._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'posted' }),
            });
            if (!response.ok) throw new Error('Failed to update post status.');
            // Call the refresh function passed from the parent page
            if (onPostSuccess) {
                onPostSuccess();
            }
        } catch (error) {
            console.error("Failed to update post status:", error);
            setPostError("Post sent, but failed to update status in DB.");
        }
    };

    const handlePost = async () => {
        setPostStatus('Posting...');
        setPostError('');

        if (post.platform === 'X' || post.platform === 'Twitter') {
            try {
                const tweetContent = `${content} ${tags.join(' ')}`;
                const response = await fetch('/api/postTweet', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tweetText: tweetContent }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.details || 'Failed to post tweet.');
                }
                
                setPostStatus('Posted!');
                await updateStatusToPosted(); // This will trigger the refresh
            } catch (error) {
                console.error(error);
                setPostError(error.message);
                setPostStatus('Error!');
                setTimeout(() => setPostStatus('Post Now'), 3000);
            }
        } else {
            console.log(`Posting to ${post.platform} is not yet implemented.`);
            setPostError(`Posting to ${post.platform} is not supported yet.`);
            setPostStatus('Error!');
            setTimeout(() => setPostStatus('Post Now'), 3000);
        }
    };
    
    const removeTag = (indexToRemove) => {
        setTags(currentTags => currentTags.filter((_, index) => index !== indexToRemove));
    };

    const confirmDelete = () => {
        onDelete(post._id);
    };

    const platformIcon = platformIcons[post.platform] || platformIcons['default'];

    const formattedTimestamp = () => {
        const date = new Date(post.postedAt);
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'America/New_York' };
        
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        return `${formattedDate} @ ${formattedTime} ET`;
    };

    const isPosted = status === 'posted';
    const characterCount = content.length + (tags.length > 0 ? tags.join(' ').length + 1 : 0);

    return (
        <div className="bg-slate-800/50 ring-1 ring-slate-700/50 rounded-xl shadow-lg flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-cyan-400">{platformIcon}</span>
                        <h3 className="text-xl font-bold text-slate-100">{post.platform}</h3>
                    </div>
                    <p className="text-xs text-slate-400 whitespace-nowrap">{formattedTimestamp()}</p>
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    readOnly={isPosted}
                    className={`w-full p-2 bg-slate-800 border border-slate-600 rounded-md text-slate-300 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all h-40 resize ${isPosted ? 'resize-none' : ''}`}
                />
                 {!isPosted && (
                    <div className="text-right text-xs text-slate-400 mt-1">
                        {characterCount} characters
                    </div>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                    {(tags || []).map((tag, index) => (
                        <span key={index} className="flex items-center px-3 py-1 bg-cyan-400/10 text-cyan-300 text-sm font-medium rounded-full">
                            {tag}
                            {!isPosted && (
                                <button onClick={() => removeTag(index)} className="ml-2 -mr-1 text-cyan-200 hover:text-white text-lg leading-none">&times;</button>
                            )}
                        </span>
                    ))}
                </div>
                {postError && <p className="text-xs text-red-400 mt-2">{postError}</p>}
            </div>
            <div className="flex items-center justify-between p-4 border-t border-slate-700/50 bg-slate-800/30 rounded-b-xl">
                 <div>
                    {!isDeleting ? (
                        <button onClick={() => setIsDeleting(true)} className="p-2 text-slate-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                             <button onClick={confirmDelete} className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">Confirm</button>
                             <button onClick={() => setIsDeleting(false)} className="px-3 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-600 rounded-md">Cancel</button>
                        </div>
                    )}
                 </div>
                 <div className="flex items-center space-x-3">
                    {!isPosted && (
                        <button 
                            onClick={handleSave} 
                            disabled={saveStatus !== 'Save Changes'} 
                            className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                            <span>{saveStatus}</span>
                        </button>
                    )}
                     <button 
                        onClick={handlePost} 
                        disabled={postStatus !== 'Post Now' || isPosted} 
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-600"
                    >
                        <span>{isPosted ? 'Posted' : postStatus}</span>
                    </button>
                 </div>
            </div>
        </div>
    );
}
