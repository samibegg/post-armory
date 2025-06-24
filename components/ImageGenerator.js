import { useState, useEffect } from 'react';

// Accept an initialPrompt prop to pre-fill the textarea
export default function ImageGenerator({ initialPrompt = '' }) {
  // Set the initial state of the prompt from the prop
  const [prompt, setPrompt] = useState(initialPrompt);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // This hook ensures that if the posts are regenerated with a *new* idea,
  // the image prompt updates to match the new context.
  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) {
        setError('Please enter a prompt to generate an image.');
        return;
    }
    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      // NOTE: This uses the direct 'fetch' method from our final working solution.
      const response = await fetch('/api/generate-image', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      setImageUrl(data.image); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      {/* Updated form container to match IdeaForm's style */}
      <div className="w-full bg-slate-800/30 ring-1 ring-slate-700/50 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
        <form onSubmit={handleSubmit}>
          <label htmlFor="prompt" className="block text-lg font-medium text-slate-200 mb-3">
            Image Prompt
          </label>
          <textarea
            id="prompt"
            name="prompt"
            rows="3"
            // Updated textarea styles to match IdeaForm's style
            className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A photorealistic image of a futuristic city at sunset"
          />
          <div className="mt-6">
            {/* --- UPDATED BUTTON --- */}
            <button
              type="submit"
              disabled={loading}
              // Copied directly from IdeaForm for a perfect style match
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Generating Image...
                </>
              ) : ( 'Generate Image' )}
            </button>
          </div>
        </form>
      </div>

      {error && <p className="mt-6 text-red-400 text-center bg-red-900/50 p-4 rounded-lg">{error}</p>}
      
      {/* The loading spinner here is no longer needed as it's inside the button */}
      {/* We only need to display the final image */}
      {imageUrl && (
        <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Your Generated Image:</h3>
            <div className="p-2 bg-slate-800/30 ring-1 ring-slate-700/50 inline-block rounded-lg">
                <img src={imageUrl} alt="AI generated content" className="rounded-md shadow-lg mx-auto" />
            </div>
        </div>
      )}
    </div>
  );
}