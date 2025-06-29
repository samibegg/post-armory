// --- /pages/settings.js (UPDATED with all fields restored) ---
import { useState as useStateSettings, useEffect as useEffectSettings, Fragment } from 'react';
import { getServerSession } from "next-auth/next";
import { Tab, RadioGroup } from '@headlessui/react';
import { nextAuthOptions } from "@/lib/auth";
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { Twitter, Facebook, Instagram, Linkedin, MessageSquare, PilcrowSquare, Globe, Bot, BrainCircuit, CheckCircle } from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const llmOptions = [
    { name: 'Google Gemini', value: 'gemini', icon: Bot },
    { name: 'OpenAI GPT', value: 'openai', icon: BrainCircuit },
    { name: 'Anthropic Claude', value: 'claude', icon: PilcrowSquare },
];

const platformFields = [
    { name: 'X', icon: <Twitter className="w-5 h-5 text-slate-400" />, urlKey: 'x_url', apiKey: 'x_api_key', docLink: 'https://developer.twitter.com/en/portal/dashboard' },
    { name: 'Facebook', icon: <Facebook className="w-5 h-5 text-slate-400" />, urlKey: 'facebook_url', apiKey: 'facebook_token', docLink: 'https://developers.facebook.com/tools/explorer/' },
    { name: 'Instagram', icon: <Instagram className="w-5 h-5 text-slate-400" />, urlKey: 'instagram_url', apiKey: 'instagram_token', docLink: 'https://developers.facebook.com/docs/instagram-basic-display-api/' },
    { name: 'LinkedIn', icon: <Linkedin className="w-5 h-5 text-slate-400" />, urlKey: 'linkedin_url', apiKey: 'linkedin_token', docLink: 'https://www.linkedin.com/developers/' },
    { name: 'TikTok', icon: <MessageSquare className="w-5 h-5 text-slate-400" />, urlKey: 'tiktok_url', apiKey: 'tiktok_token', docLink: 'https://developers.tiktok.com/' },
    { name: 'Snapchat', icon: <PilcrowSquare className="w-5 h-5 text-slate-400" />, urlKey: 'snapchat_url', apiKey: 'snapchat_token', docLink: 'https://marketingapi.snapchat.com/' }
];


export default function SettingsPage() {
    const [settings, setSettings] = useStateSettings({
        business_name: '', address: '', phone: '', email: '', system_prompt: '', llm_provider: 'gemini',
        include_business_name: false, include_address: false, include_phone: false, include_email: false,
        openai_api_key: '', anthropic_api_key: '', gemini_api_key: '',
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

    const handleLlmChange = (value) => {
        setSettings(prev => ({ ...prev, llm_provider: value }));
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
                                {['Business Profile', 'AI Settings', 'API & Links'].map((category) => (
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
                                            <input name="business_name" value={settings.business_name || ''} onChange={handleInputChange} placeholder="Business Name" className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                            <label className="flex items-center space-x-2 text-sm text-slate-300"><input type="checkbox" name="include_business_name" checked={settings.include_business_name} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-600 focus:ring-cyan-500" /><span>Include</span></label>
                                        </div>
                                         <div className="flex items-center gap-4">
                                            <input name="email" value={settings.email || ''} onChange={handleInputChange} placeholder="Contact Email" className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                            <label className="flex items-center space-x-2 text-sm text-slate-300"><input type="checkbox" name="include_email" checked={settings.include_email} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-600 focus:ring-cyan-500" /><span>Include</span></label>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input name="phone" value={settings.phone || ''} onChange={handleInputChange} placeholder="Phone Number" className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                            <label className="flex items-center space-x-2 text-sm text-slate-300"><input type="checkbox" name="include_phone" checked={settings.include_phone} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-600 focus:ring-cyan-500" /><span>Include</span></label>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input name="address" value={settings.address || ''} onChange={handleInputChange} placeholder="Address" className="flex-grow bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                            <label className="flex items-center space-x-2 text-sm text-slate-300"><input type="checkbox" name="include_address" checked={settings.include_address} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-cyan-600 focus:ring-cyan-500" /><span>Include</span></label>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel>
                                    <h2 className="text-xl font-semibold text-slate-100 mb-4">AI Configuration</h2>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">LLM Provider</label>
                                        <RadioGroup value={settings.llm_provider} onChange={handleLlmChange}>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {llmOptions.map((option) => (
                                                    <RadioGroup.Option key={option.name} value={option.value} className={({ active, checked }) => `${ active ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-cyan-400' : '' } ${ checked ? 'bg-cyan-600 text-white' : 'bg-slate-900' } relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`}>
                                                        {({ checked }) => (
                                                            <div className="flex w-full items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <div className="text-sm">
                                                                        <RadioGroup.Label as="p" className={`font-medium ${checked ? 'text-white' : 'text-slate-300'}`}>
                                                                            {option.name}
                                                                        </RadioGroup.Label>
                                                                    </div>
                                                                </div>
                                                                {checked && <div className="shrink-0 text-white"><CheckCircle className="h-6 w-6" /></div>}
                                                            </div>
                                                        )}
                                                    </RadioGroup.Option>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="mt-6">
                                        <label htmlFor="system_prompt" className="block text-sm font-medium text-slate-300 mb-2">AI System Prompt</label>
                                        <div className="text-xs text-slate-400 space-y-1 mb-2">
                                            <p>To get the best results, provide the AI with detailed context about your brands personality.</p>
                                        </div>
                                        <textarea name="system_prompt" rows="8" value={settings.system_prompt || ''} onChange={handleInputChange} placeholder="e.g., I am a solo developer creating AI tools..." className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel className="space-y-6">
                                    <h2 className="text-xl font-semibold text-slate-100">LLM API Keys (Encrypted)</h2>
                                    <div className="space-y-4">
                                        <input type="password" name="gemini_api_key" value={settings.gemini_api_key || ''} onChange={handleInputChange} placeholder="Google Gemini API Key" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                        <input type="password" name="openai_api_key" value={settings.openai_api_key || ''} onChange={handleInputChange} placeholder="OpenAI API Key" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                        <input type="password" name="anthropic_api_key" value={settings.anthropic_api_key || ''} onChange={handleInputChange} placeholder="Anthropic (Claude) API Key" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                    </div>
                                    <hr className="border-slate-700" />
                                    <h2 className="text-xl font-semibold text-slate-100">Social API Keys & Links</h2>
                                     <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-5 h-5 text-slate-400" />
                                            <input name="website_url" value={settings.website_url || ''} onChange={handleInputChange} placeholder="https://yourwebsite.com" className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                        </div>
                                        <hr className="border-slate-700" />
                                    </div>
                                    {platformFields.map(platform => (
                                        <div key={platform.name} className="space-y-2">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0 w-6 text-center">{platform.icon}</div>
                                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input name={platform.urlKey} value={settings[platform.urlKey] || ''} onChange={handleInputChange} placeholder={`${platform.name} URL`} className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                                    <input type="password" name={platform.apiKey} value={settings[platform.apiKey] || ''} onChange={handleInputChange} placeholder={`${platform.name} API Key/Token`} className="w-full bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" />
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-400 pl-10">Get your keys from the <a href={platform.docLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{platform.name} Developer Portal</a>.</p>
                                        </div>
                                    ))}
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
