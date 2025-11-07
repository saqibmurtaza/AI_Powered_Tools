import React from 'react';

import {
    
    ACCENT_COLOR_CLASS, ACCENT_TEXT_COLOR_CLASS, TEXT_COLOR_CLASS
} from '../../lib/gemini';

const ContextCardsPage: React.FC = () => (
    <main className="pt-24 min-h-screen">
        <section className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
            <p className={`text-sm font-semibold uppercase tracking-widest mb-4 ${ACCENT_TEXT_COLOR_CLASS}`}>
                An innovation lab by Saqib Murtaza, crafting AI-driven productivity tools.
            </p>
            <h1 className={`text-4xl md:text-6xl font-extrabold mb-6 ${TEXT_COLOR_CLASS}`}>
                Introducing <span className={ACCENT_TEXT_COLOR_CLASS}>ContextCards</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl">
                MemorAI Cards revolutionizes how you capture and retrieve information. It uses cutting-edge AI to instantly categorize, summarize, and link your notes to their relevant context. Stop searching. Start retrieving.
            </p>

            {/* Product Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             
            
                
                <div className="md:col-span-2 lg:col-span-3">
                    <div className={`p-8 ${ACCENT_COLOR_CLASS} rounded-2xl text-white`}>
                        <h3 className="text-2xl font-bold mb-2">Ready to Try ContextCards?</h3>
                        <p className="text-lg opacity-90 mb-4">
                            The future of intelligent knowledge management is here.
                        </p>
                        <button className="px-6 py-3 text-base font-semibold text-gray-900 bg-white rounded-xl hover:bg-gray-100 transition duration-150">
                            Join Waitlist Today
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </main>
);

export default ContextCardsPage;
