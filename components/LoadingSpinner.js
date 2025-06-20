// --- /components/LoadingSpinner.js ---
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-400"></div>
    </div>
  );
}

