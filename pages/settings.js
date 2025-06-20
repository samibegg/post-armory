// --- /pages/settings.js (UPDATED) ---
import { useState as useStateSettings, useEffect as useEffectSettings } from 'react';
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from "@/lib/auth";
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SettingsPage() {
    const [settings, setSettings] = useStateSettings({ x_api_key: '', facebook_token: '', system_prompt: '' });
    const [isLoading, setIsLoading] = useStateSettings(true);
    const [saveStatus, setSaveStatus] = useStateSettings('');

    useEffectSettings(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setIsLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveStatus('Saving...');
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        if (res.ok) {
            setSaveStatus('Saved successfully!');
        } else {
            setSaveStatus('Error saving settings.');
        }
        setTimeout(() => setSaveStatus(''), 3000);
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    }
    
    return (
        <div className="min-h-screen bg-slate-900">
            <Header />
            <main className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-center mb-10">Account Settings</h1>
                <form onSubmit={handleSave} className="max-w-xl mx-auto bg-slate-800/50 p-8 rounded-lg ring-1 ring-slate-700">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="system_prompt" className="block text-sm font-medium text-slate-300 mb-2">System Prompt</label>
                            <p className="text-xs text-slate-400 mb-2">Provide context about your brand, voice, and tone. This will be used by the AI when generating posts.</p>
                            <textarea
                                name="system_prompt"
                                id="system_prompt"
                                rows="6"
                                value={settings.system_prompt || ''}
                                onChange={handleInputChange}
                                placeholder="e.g., I am a solo developer creating AI tools. My tone should be helpful, slightly informal, and exciting. I use emojis sparingly."
                                className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                            />
                        </div>
                        <div className="border-t border-slate-700 pt-6 space-y-6">
                            <div>
                                <label htmlFor="x_api_key" className="block text-sm font-medium text-slate-300">X (Twitter) API Key</label>
                                <input
                                    type="password"
                                    name="x_api_key"
                                    id="x_api_key"
                                    value={settings.x_api_key || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="facebook_token" className="block text-sm font-medium text-slate-300">Facebook API Token</label>
                                <input
                                    type="password"
                                    name="facebook_token"
                                    id="facebook_token"
                                    value={settings.facebook_token || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end items-center">
                        {saveStatus && <p className="text-sm text-cyan-400 mr-4">{saveStatus}</p>}
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors"
                        >
                            Save Settings
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, nextAuthOptions);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    
    return {
        props: { session: JSON.parse(JSON.stringify(session)) },
    };
}
