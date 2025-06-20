export default function Header() {
  return (
    <header className="w-full bg-slate-900 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
             <svg className="h-8 w-8 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.786-2.673 9.397m-1.656 0A10.002 10.002 0 014 13H2a12.002 12.002 0 005.673 10.397m1.656 0L12 21m0-10v-1a2 2 0 00-2-2h-1m3 3h1a2 2 0 002-2v-1m-5 5v1a2 2 0 002 2h1m-3-3h-1a2 2 0 00-2 2v1" />
            </svg>
            <h1 className="text-2xl font-bold text-white ml-3">Social Post Generator</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
