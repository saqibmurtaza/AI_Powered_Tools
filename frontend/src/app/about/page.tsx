// page.tsx (Server Component for /about)
import React from 'react';
import { ACCENT_TEXT_COLOR_CLASS, TEXT_COLOR_CLASS } from '../../lib/gemini';

const AboutPage: React.FC = () => (
    <main className="pt-24 min-h-screen">
        <section className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={`text-5xl font-extrabold mb-4 ${TEXT_COLOR_CLASS}`}>
                Welcome to the <span className={ACCENT_TEXT_COLOR_CLASS}>Story</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                This page details our mission, values, and the story of how Digital SM Studio is pioneering the future of Agentic AI.
            </p>
        </section>

        <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-2xl mb-20 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Next Step: Content Development</h2>
            <p className="text-gray-600">
                Flesh out the brand story and team details here.
            </p>
        </div>
    </main>
);

export default AboutPage;
