// --- /pages/index.js (LANDING PAGE - UPDATED) ---
// Simplified to remove form logic, which is now in the modal.
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

export default function LandingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // If user is authenticated, redirect them to the main app page
    if (status === 'authenticated') {
        router.push('/generator');
        return null; 
    }

    return (
        <div className="min-h-screen bg-slate-900">
            <Header />
            <main className="container mx-auto px-4 text-center py-24 sm:py-32">
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                    Create Social Posts in Seconds
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-400">
                    Stop staring at a blank screen. Turn your ideas into a weeks worth of social media content with the power of AI.
                </p>
                <div className="mt-10">
                    {/* The Header now contains the button to open the sign-in modal */}
                </div>
            </main>
        </div>
    );
}

