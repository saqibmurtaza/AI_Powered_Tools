'use client';

import React, { useState, useCallback } from 'react';
import {
    BookOpen, Loader,
    ACCENT_COLOR_CLASS, ACCENT_TEXT_COLOR_CLASS, SUBTLE_SHADOW_CLASS, TEXT_COLOR_CLASS,
    callGeminiApi
} from '../../lib/gemini';

const BlogGeneratorPage: React.FC = () => {
    const [blogTopic, setBlogTopic] = useState('');
    const [blogOutline, setBlogOutline] = useState('');
    const [isLoadingOutline, setIsLoadingOutline] = useState(false);
    const [error, setError] = useState('');

    const generateOutline = useCallback(async () => {
        if (!blogTopic.trim()) {
            setError("Please enter a compelling topic for your blog post.");
            return;
        }
        
        setError('');
        setIsLoadingOutline(true);
        setBlogOutline('');
        
        const prompt = `Generate a comprehensive, professional blog post outline for the topic: "${blogTopic}". The outline must include a bold H1 title, a concise introduction paragraph, 4-5 descriptive H2 section titles, and a concluding summary. Format the output using markdown headings (# and ##) and bullet points. Ensure the content is insightful and focuses on agentic AI, automation, or productivity.`;
        const systemInstruction = "You are an expert content strategist for a leading AI studio (Digital SM Studio). Your tone should be authoritative, insightful, and focused on cutting-edge technology.";

        // Using Google Search grounding
        const tools = [{ "google_search": {} }]; 
        
        const { text } = await callGeminiApi(prompt, systemInstruction, tools);

        setBlogOutline(text);
        setIsLoadingOutline(false);
    }, [blogTopic]);

    return (
        <main className="pt-24 min-h-screen">
            <section className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
                <h1 className={`text-5xl font-extrabold mb-4 ${TEXT_COLOR_CLASS} text-center`}>
                    The <span className={ACCENT_TEXT_COLOR_CLASS}>AI Blog</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-3xl mx-auto text-center mb-10">
                    Insights on AI, automation, and intelligent tools. Let our content agent help you draft your next article!
                </p>

                {/* AI Outline Generator Card */}
                <div className={`p-8 bg-white border border-gray-100 rounded-3xl ${SUBTLE_SHADOW_CLASS}`}>
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                        <BookOpen className={`h-6 w-6 mr-2 ${ACCENT_TEXT_COLOR_CLASS}`} /> ✨ AI Blog Outline Generator
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Enter a topic below to instantly generate a structured, production-ready blog outline for your AI content strategy.
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                        <input
                            type="text"
                            placeholder="e.g., The Impact of LLMs on Agile Development"
                            value={blogTopic}
                            onChange={(e) => setBlogTopic(e.target.value)}
                            className="flex-grow p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                            disabled={isLoadingOutline}
                        />
                        <button
                            onClick={generateOutline}
                            disabled={isLoadingOutline}
                            className={`flex items-center justify-center px-6 py-3 text-base font-semibold text-white ${ACCENT_COLOR_CLASS} rounded-xl hover:opacity-90 transition duration-150 ${isLoadingOutline ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {isLoadingOutline ? (
                                <><Loader className="animate-spin h-5 w-5 mr-2" /> Generating Outline...</>
                            ) : (
                                'Generate Outline'
                            )}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    
                    {blogOutline && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="text-xl font-bold mb-2">Generated Outline</h3>
                            {/* Render generated markdown content */}
                            <div className="p-4 bg-gray-50 rounded-xl whitespace-pre-wrap overflow-x-auto text-gray-700">
                               {blogOutline}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default BlogGeneratorPage;
