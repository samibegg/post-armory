// --- /pages/settings.js (UPDATED) ---
import { useState as useStateSettings, useEffect as useEffectSettings, Fragment } from 'react';
import { getServerSession } from "next-auth/next";
import { Tab } from '@headlessui/react';
import { nextAuthOptions } from "@/lib/auth";
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SettingsPage() {
    const [settings, setSettings] = useStateSettings({
        business_name: '', address: '', phone: '', email: '', system_prompt: '',
        include_business_name: false, include_address: false, include_phone: false, include_email: false,
        x_api_key: '', facebook_token: '', instagram_token: '', linkedin_token: '', tiktok_token: '', snapchat_token: '',
        x_url: '', facebook_url: '', instagram_url: '', linkedin_url: '', tiktok_url: '', snapchat_url: '', website_url: ''
    });
    const [isLoading, setIsLoading] = useStateSettings(true);
    const [saveStatus, setSaveStatus] = useStateSettings('');

    useEffectSettings(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(prev => ({ ...prev, ...data }));
                setIsLoading(false);
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setSettings(prev => ({ ...prev, [name]: val }));
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
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-10">Account Settings</h1>
                    <form onSubmit={handleSave}>
                        <Tab.Group>
                            <Tab.List className="flex space-x-1 rounded-xl bg-slate-800/50 p-1 mb-6">
                                {['Business Profile', 'System Prompt', 'API & Links'].map((category) => (
                                    <Tab key={category} className={({ selected }) => classNames( 'w-full rounded-lg py-2.5 text-sm font-medium leading-5', 'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-cyan-400 ring-white ring-opacity-60', selected ? 'bg-slate-700 shadow text-cyan-400' : 'text-slate-300 hover:bg-white/[0.12] hover:text-white' )}>
                                        {category}
                                    </Tab>
                                ))}
                            </Tab.List>
                            <Tab.Panels className="bg-slate-800/50 p-8 rounded-lg ring-1 ring-slate-700">
                                <Tab.Panel className="space-y-6">
                                    <h2 className="text-xl font-semibold text-slate-100">Business Information</h2>
                                    <p className="text-sm text-slate-400">Select which details to include in the AI prompt context.</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <input name="business_name" value={settings.business_name} onChange={handleInputChange} placeholder="Business Name" className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            <label className="flex items-center space-x-2 text-sm text-slate-300"><input type="checkbox" name="include_business_name" checked={settings.include_business_name} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-600 focus:ring-cyan-500" /><span>Include</span></label>
                                        </div>
                                         <div className="flex items-center gap-4">
                                            <input name="email" value={settings.email} onChange={handleInputChange} placeholder="Contact Email" className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            <label className="flex items-center space-x-2 text-sm text-slate-300"><input type="checkbox" name="include_email" checked={settings.include_email} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-600 focus:ring-cyan-500" /><span>Include</span></label>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input name="phone" value={settings.phone} onChange={handleInputChange} placeholder="Phone Number" className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            <label className="flex items-center space-x-2 text-sm text-slate-300"><input type="checkbox" name="include_phone" checked={settings.include_phone} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-600 focus:ring-cyan-500" /><span>Include</span></label>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input name="address" value={settings.address} onChange={handleInputChange} placeholder="Address" className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            <label className="flex items-center space-x-2 text-sm text-slate-300"><input type="checkbox" name="include_address" checked={settings.include_address} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-600 focus:ring-cyan-500" /><span>Include</span></label>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <h2 className="text-xl font-semibold text-slate-100 mb-2">AI System Prompt</h2>
                                    <div className="text-xs text-slate-400 space-y-1 mb-2">
                                        <p>To get the best results, provide the AI with detailed context about your brand's personality.</p>
                                        <ul className="list-disc list-inside pl-2 space-y-1">
                                            <li><strong>Voice and Tone:</strong> e.g., "The tone should be encouraging and humorous."</li>
                                            <li><strong>Keywords:</strong> e.g., "Always include keywords like #Productivity, #AI."</li>
                                            <li><strong>Goals:</strong> e.g., "The goal is to drive traffic to my blog."</li>
                                        </ul>
                                    </div>
                                    <textarea name="system_prompt" rows="8" value={settings.system_prompt} onChange={handleInputChange} placeholder="e.g., I am a solo developer creating AI tools..." className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                </Tab.Panel>
                                <Tab.Panel className="space-y-6">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold text-slate-100">API Keys & Social Links</h2>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input name="x_url" value={settings.x_url} onChange={handleInputChange} placeholder="X / Twitter URL" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                                <input type="password" name="x_api_key" value={settings.x_api_key} onChange={handleInputChange} placeholder="X (Twitter) API Key" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            </div>
                                            <p className="text-xs text-slate-400 -mt-2 pl-1">Get your keys from the <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">X Developer Portal</a>.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input name="facebook_url" value={settings.facebook_url} onChange={handleInputChange} placeholder="Facebook Page URL" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                                <input type="password" name="facebook_token" value={settings.facebook_token} onChange={handleInputChange} placeholder="Facebook API Token" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            </div>
                                            <p className="text-xs text-slate-400 -mt-2 pl-1">Get your token from the <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Meta for Developers</a> page.</p>
                                        </div>
                                         <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input name="instagram_url" value={settings.instagram_url} onChange={handleInputChange} placeholder="Instagram URL" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                                <input type="password" name="instagram_token" value={settings.instagram_token} onChange={handleInputChange} placeholder="Instagram API Token" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            </div>
                                             <p className="text-xs text-slate-400 -mt-2 pl-1">Get your token from the <a href="https://developers.facebook.com/docs/instagram-basic-display-api/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Meta for Developers</a> page.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input name="linkedin_url" value={settings.linkedin_url} onChange={handleInputChange} placeholder="LinkedIn URL" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                                <input type="password" name="linkedin_token" value={settings.linkedin_token} onChange={handleInputChange} placeholder="LinkedIn API Token" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            </div>
                                            <p className="text-xs text-slate-400 -mt-2 pl-1">Get your keys from the <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">LinkedIn Developer Portal</a>.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input name="tiktok_url" value={settings.tiktok_url} onChange={handleInputChange} placeholder="TikTok URL" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                                <input type="password" name="tiktok_token" value={settings.tiktok_token} onChange={handleInputChange} placeholder="TikTok API Token" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            </div>
                                            <p className="text-xs text-slate-400 -mt-2 pl-1">Get your keys from the <a href="https://developers.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">TikTok for Developers</a> portal.</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input name="snapchat_url" value={settings.snapchat_url} onChange={handleInputChange} placeholder="Snapchat URL" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                                <input type="password" name="snapchat_token" value={settings.snapchat_token} onChange={handleInputChange} placeholder="Snapchat API Token" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500" />
                                            </div>
                                            <p className="text-xs text-slate-400 -mt-2 pl-1">Get your keys from the <a href="https://marketingapi.snapchat.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Snapchat Marketing API</a>.</p>
                                        </div>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                        <div className="mt-8 flex justify-end items-center">
                            {saveStatus && <p className="text-sm text-cyan-400 mr-4">{saveStatus}</p>}
                            <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors">
                                Save All Settings
                            </button>
                        </div>
                    </form>
                </div>
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
