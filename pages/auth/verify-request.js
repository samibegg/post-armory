// --- /pages/auth/verify-request.js (NEW) ---
import Header from '../../components/Header';

export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-slate-900">
        <Header />
        <main className="container mx-auto px-4 text-center py-24 sm:py-32">
            <h1 className="text-5xl font-extrabold text-slate-100">Check your email</h1>
            <p className="mt-6 max-w-md mx-auto text-lg text-slate-400">
                A sign in link has been sent to your email address.
            </p>
        </main>
    </div>
  )
}
