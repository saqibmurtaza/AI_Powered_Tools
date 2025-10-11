// Define constants for styling and API access
export const ACCENT_COLOR_CLASS = 'bg-[#7C3AED]';
export const ACCENT_TEXT_COLOR_CLASS = 'text-[#7C3AED]';
export const TEXT_COLOR_CLASS = 'text-gray-900';
export const SUBTLE_SHADOW_CLASS = 'shadow-xl shadow-[#7c3aed30]/10 hover:shadow-[#7c3aed50]/20 transition duration-300';
export const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";
export const API_KEY = ""; // Placeholder for Canvas runtime environment

// --- INLINE ICON DEFINITIONS ---
import React from 'react';

const IconBase = ({ size = 24, color = "currentColor", strokeWidth = "2", children, ...props }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
        {children}
    </svg>
);

// Define the component internally
const BotIconComponent = (props: any) => (
    <IconBase {...props}><path d="M12 8V4H8"/><path d="M12 14V8"/><path d="M19 12V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2h3"/><path d="M12 2v2"/><path d="M21 17a2 2 0 0 0 0-4H3a2 2 0 0 0 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/></IconBase>
);
export const ZapIcon = (props: any) => (
    <IconBase {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></IconBase>
);
export const GlobeIcon = (props: any) => (
    <IconBase {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></IconBase>
);
export const MessageSquareIcon = (props: any) => (
    <IconBase {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></IconBase>
);
export const BriefcaseIcon = (props: any) => (
    <IconBase {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></IconBase>
);
export const UsersIcon = (props: any) => (
    <IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></IconBase>
);
export const FileTextIcon = (props: any) => (
    <IconBase {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></IconBase>
);
export const MenuIcon = (props: any) => (
    <IconBase {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></IconBase>
);
export const XIcon = (props: any) => (
    <IconBase {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></IconBase>
);
export const ArrowRightIcon = (props: any) => (
    <IconBase {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></IconBase>
);
export const BookOpenIcon = (props: any) => (
    <IconBase {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>
);
export const LoaderIcon = (props: any) => (
    <IconBase {...props}><path d="M12 2v4"/><path d="m16.2 7.8 2.5-2.5"/><path d="M22 12h-4"/><path d="m16.2 16.2 2.5 2.5"/><path d="M12 22v-4"/><path d="m7.8 16.2-2.5 2.5"/><path d="M2 12h4"/><path d="m7.8 7.8-2.5-2.5"/></IconBase>
);

// --- GEMINI API FUNCTION (Fixes Type 2339 errors) ---

interface GeminiPayload {
    contents: { parts: { text: string }[] }[];
    // Explicitly marking optional fields to resolve Type 2339 errors
    systemInstruction?: { parts: { text: string }[] };
    tools?: any;
}

export const callGeminiApi = async (prompt: string, systemInstruction: string | null = null, tools: any | null = null) => {
    const maxRetries = 3;
    let delay = 1000;

    const payload: GeminiPayload = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    if (tools) {
        payload.tools = tools;
    }

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Error: Could not retrieve content.';
            
            return { text };

        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                return { text: 'Sorry, the AI service is currently unavailable. Please try again later.' };
            }
        }
    }
    return { text: 'Unknown error occurred after retries.' };
};

// --- convenience aliases so imports like `Zap`, `Globe` work ----------------
export {
  ZapIcon as Zap,
  GlobeIcon as Globe,
  UsersIcon as Users,
  LoaderIcon as Loader,
  ArrowRightIcon as ArrowRight,
  FileTextIcon as FileText,
  BriefcaseIcon as Briefcase,
  MessageSquareIcon as MessageSquare,
  // export the internal BotIconComponent under the public name BotIcon
  BotIconComponent as BotIcon,
};
