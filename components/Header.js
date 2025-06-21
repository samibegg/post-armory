// --- /components/Header.js (UPDATED) ---
import { useState } from 'react'
import { useSession, signOut } from "next-auth/react"
import Link from 'next/link'
import AuthModal from './AuthModal'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <header className="w-full bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href={session ? "/generator" : "/"} className="flex items-center space-x-3">
               <svg className="h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L9 13"/></svg>
              <h1 className="text-2xl font-bold text-slate-100">Post Armory</h1>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center space-x-4">
              {session ? (
                <>
                  <Link href="/generator" className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors">Generator</Link>
                  <Link href="/poster" className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors">Poster</Link>
                  <Link href="/settings" className="px-3 py-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors">Settings</Link>
                  <button onClick={() => signOut()} className="px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors">
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button & Sign In */}
            <div className="sm:hidden flex items-center">
              {session ? (
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-700">
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
              ) : (
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && session && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/generator" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">Generator</Link>
              <Link href="/poster" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">Poster</Link>
              <Link href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">Settings</Link>
              <button onClick={() => signOut()} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
