// pages/social-media-guidelines.js
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import { 
  FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaSnapchatGhost, FaPinterest, FaThreads, FaTiktok 
} from 'react-icons/fa6';

const channels = [
  { name: 'Facebook', icon: FaFacebook, summary: 'Community building, local awareness, events, ads with specific targeting.', details: [
    'Best for: Community building, local awareness, events, ads with specific targeting.',
    'Post Length: 40–80 characters with a clear CTA.',
    'Media: High-quality images, videos, carousels.',
    'Tactics: Facebook Events, pinned posts, geo-targeted ads, Messenger bots.',
    'Frequency: 3–5 posts/week. Best times: Wed–Fri 1–4 PM.'
  ]},
  { name: 'Instagram', icon: FaInstagram, summary: 'Visual branding, product showcases, influencer marketing.', details: [
    'Post Types: Feed posts, Reels, Stories, Carousels.',
    'Captions: Short with emojis and hashtags.',
    'Media: Branded, lifestyle visuals.',
    'Tactics: Geo-tagging, influencer takeovers, Link in Bio.',
    'Frequency: Feed 3–5x/week, Stories daily. Best times: Tues–Thurs 9–11 AM, 4–6 PM.'
  ]},
  { name: 'TikTok', icon: FaTiktok, summary: 'Viral reach, humor, trends, younger audiences.', details: [
    'Video Length: 7–15 sec ideal.',
    'Style: Authentic, vertical, trending audio.',
    'Content: Day-in-the-life, demos, tips.',
    'Hashtags: 3–5 relevant + trending + branded.',
    'Frequency: Daily or 5–7x/week. Best times: Weekdays 6–10 AM or 7–10 PM.'
  ]},
  { name: 'YouTube', icon: FaYoutube, summary: 'Deep engagement, education, SEO benefits.', details: [
    'Long-form: 3–10 min. Shorts: 15–60 sec.',
    'Titles: Keyword + benefit driven.',
    'Thumbnails: Bold text, expressive face.',
    'SEO: Tags, descriptions, timestamps.',
    'Frequency: 1–2 long videos/week + 3–5 Shorts. Best times: Thurs–Sun 12–6 PM.'
  ]},
  { name: 'LinkedIn', icon: FaLinkedin, summary: 'Professional branding, referrals, partnerships.', details: [
    'Post Length: 150–300 words.',
    'Post Types: Advice, behind-the-scenes, team spotlights.',
    'Tone: Warm, authoritative.',
    'Media: PDFs, portraits, quote graphics.',
    'Frequency: 3–4x/week. Best times: Tues–Thurs 8–10 AM.'
  ]},
  { name: 'X (Twitter)', icon: FaTwitter, summary: 'Quick engagement, trendjacking, brand voice.', details: [
    'Character Limit: 280.',
    'Style: Witty, concise, informative.',
    'Content: Tips, GIFs, polls, trends.',
    'Media: Use visuals for better engagement.',
    'Frequency: 2–5 tweets/day. Best times: Weekdays 9 AM–3 PM.'
  ]},
  { name: 'Snapchat', icon: FaSnapchatGhost, summary: 'Youth engagement, behind-the-scenes, flash deals.', details: [
    'Content: Stories, Snaps, Lenses.',
    'Style: Raw, mobile-first.',
    'Tactics: Geo-filters, flash sales, day-in-the-life.',
    'Frequency: 3–6 stories/week. Best times: Evenings/weekends.'
  ]},
  { name: 'Pinterest', icon: FaPinterest, summary: 'SEO traffic, blog-style content, evergreen pins.', details: [
    'Post Types: Infographics, how-tos, visuals.',
    'Image Size: Vertical, 2:3 ratio.',
    'Tactics: SEO-rich titles/descriptions, link pins to site.',
    'Frequency: 5–10 pins/week. Best times: Sat–Sun, late evening.'
  ]},
  { name: 'Threads', icon: FaThreads, summary: 'Conversational engagement, lighter professional content.', details: [
    'Style: Authentic, spontaneous.',
    'Tactics: Ask questions, share quick wins.',
    'Use cross-posting with Instagram.',
    'Frequency: 2–3x/day.'
  ]}
];

export default function SocialMediaGuidelines() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <h1 className="text-3xl font-bold mb-8 text-center">Social Media Channel Guidelines</h1>
      {channels.map((channel, index) => (
        <div
          key={channel.name}
          className="bg-gray-800 rounded-2xl shadow-lg mb-6 p-4 hover:bg-gray-700 transition"
        >
          <button
            onClick={() => toggleDetails(index)}
            className="w-full text-left flex justify-between items-center text-xl font-semibold"
          >
            {channel.name}
            {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <p className="mt-2 text-gray-300">{channel.summary}</p>
          {openIndex === index && (
            <ul className="mt-4 list-disc list-inside space-y-2 text-sm text-gray-200">
              {channel.details.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

