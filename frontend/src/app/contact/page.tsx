// page.tsx (Server Component for /contact)
import React from 'react';
import { ACCENT_TEXT_COLOR_CLASS, TEXT_COLOR_CLASS } from '../../lib/gemini';

const ContactPage: React.FC = () => (
    <main className="pt-24 min-h-screen">
        <section className="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className={`text-5xl font-extrabold mb-4 ${TEXT_COLOR_CLASS}`}>
                Welcome to the <span className={ACCENT_TEXT_COLOR_CLASS}>Connect</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                Reach out to us for partnership inquiries, project proposals, or feedback on our intelligent tools.
            </p>
        </section>

        <div className="max-w-4xl mx-auto p-8 bg-gray-50 rounded-2xl mb-20 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Next Step: Form Implementation</h2>
            <p className="text-gray-600">
                Implement a secure, professional contact form here, potentially using a server action or a dedicated API route.
            </p>
        </div>
    </main>
);

export default ContactPage;
