// --- /components/AuthModal.js (UPDATED) ---
import { Fragment, useState } from 'react'
import { Dialog, Transition, Tab } from '@headlessui/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter();
  // Use separate state for sign-in and sign-up forms
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData(prev => ({ ...prev, [name]: value }));
  }

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({ ...prev, [name]: value }));
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', {
      redirect: false,
      email: signInData.email,
      password: signInData.password,
    });

    if (result.error) {
      setError(result.error);
    } else {
      onClose();
      router.push('/generator'); // Explicitly redirect on success
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signUpData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Automatically sign in the user after successful registration
      const result = await signIn('credentials', {
        redirect: false,
        email: signUpData.email,
        password: signUpData.password,
      });

      if (result.error) {
        setError(result.error);
      } else {
        onClose();
        router.push('/generator'); // Explicitly redirect on success
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const handleTabChange = () => {
    // Clear errors and form data when switching tabs
    setError('');
    setSignInData({ email: '', password: '' });
    setSignUpData({ name: '', email: '', password: '' });
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
                 <Tab.Group onChange={handleTabChange}>
                    <Tab.List className="flex space-x-1 rounded-xl bg-slate-900/50 p-1">
                      {['Sign In', 'Create Account'].map((category) => (
                        <Tab
                          key={category}
                          className={({ selected }) =>
                            classNames(
                              'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-cyan-500',
                              'ring-white ring-opacity-60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2',
                              selected
                                ? 'bg-slate-700 shadow'
                                : 'text-slate-300 hover:bg-white/[0.12] hover:text-white'
                            )
                          }
                        >
                          {category}
                        </Tab>
                      ))}
                    </Tab.List>
                    <Tab.Panels className="mt-4">
                      <Tab.Panel>
                        <form onSubmit={handleSignIn} className="space-y-4">
                          <input type="email" name="email" value={signInData.email} onChange={handleSignInChange} placeholder="Email" required className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                          <input type="password" name="password" value={signInData.password} onChange={handleSignInChange} placeholder="Password" required className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                          <button type="submit" className="w-full px-8 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-700 transition-all duration-300">Sign In</button>
                        </form>
                      </Tab.Panel>
                      <Tab.Panel>
                        <form onSubmit={handleSignUp} className="space-y-4">
                           <input type="text" name="name" value={signUpData.name} onChange={handleSignUpChange} placeholder="Name" required className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                          <input type="email" name="email" value={signUpData.email} onChange={handleSignUpChange} placeholder="Email" required className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                          <input type="password" name="password" value={signUpData.password} onChange={handleSignUpChange} placeholder="Password" required className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                          <button type="submit" className="w-full px-8 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg hover:bg-cyan-700 transition-all duration-300">Create Account</button>
                        </form>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                  <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-600"></span></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-800 text-slate-400">Or</span></div>
                  </div>
                  <button onClick={() => signIn('google')} className="mt-6 w-full px-4 py-3 text-base font-bold text-white bg-slate-700/50 rounded-lg shadow-lg hover:bg-slate-700 transition-all duration-300 flex items-center justify-center space-x-3">
                    <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.519-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.84,44,30.338,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                    <span>Continue with Google</span>
                  </button>
                  {error && <p className="text-sm text-red-400 text-center mt-2">{error}</p>}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}