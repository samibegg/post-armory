// --- /components/IdeaForm.js (UPDATED) ---
export default function IdeaForm({ idea, setIdea, handleSubmit, isLoading, rows = 4 }) {
  return (
    // Removed max-width class to allow parent to control width
    <div className="w-full bg-slate-800/30 ring-1 ring-slate-700/50 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
      <form onSubmit={handleSubmit}>
        <label htmlFor="idea" className="block text-lg font-medium text-slate-200 mb-3">
          Enter your post idea
        </label>
        <textarea
          id="idea"
          name="idea"
          rows={rows} // Use the rows prop
          className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
          placeholder="e.g., 'A new AI tool that automatically generates stunning presentations from a simple text prompt...'"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          required
        ></textarea>
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Generating...
              </>
            ) : ( 'Generate Posts' )}
          </button>
        </div>
      </form>
    </div>
  );
}
