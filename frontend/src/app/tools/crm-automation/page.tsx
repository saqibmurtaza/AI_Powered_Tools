// frontend/src/app/tools/crm-automation/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function CRMAutomationPage() {
  const [formStatus, setFormStatus] = useState('idle');
  const [submissionCount, setSubmissionCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  useEffect(() => {
    const count = localStorage.getItem('crm-demo-count') || '0';
    setSubmissionCount(parseInt(count));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // REPLACE THIS WITH YOUR ACTUAL n8n WEBHOOK URL
      const response = await fetch('https://digitalsmk.app.n8n.cloud/webhook/7d3094ad-9443-4039-8db1-5e4dd8f2672f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'Smart Digital Tools - CRM Demo'
        })
      });

      if (response.ok) {
        setFormStatus('success');
        const newCount = submissionCount + 1;
        setSubmissionCount(newCount);
        localStorage.setItem('crm-demo-count', newCount.toString());
        setFormData({ name: '', email: '', company: '', message: '' });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  return (
    <>
      <Head>
        <title>CRM Auto-Sync Demo | Smart Digital Tools</title>
        <meta 
          name="description" 
          content="Watch a form submission automatically create a contact in HubSpot CRM. Live automation demo." 
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with back link matching your pattern */}
          <div className="mb-8">
            <a 
              href="/tools" 
              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
            >
              ← Back to all tools
            </a>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <span className="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full font-medium">
              🚀 Live Automation Demo
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
              Forms That <span className="text-blue-600">Auto-Fill Your CRM</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fill this form once. Watch it appear in HubSpot instantly. 
              No exports. No manual entry.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{submissionCount}</div>
              <div className="text-sm text-gray-600">Demo Tests</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Manual Entries</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">⚡</div>
              <div className="text-sm text-gray-600">Instant Sync</div>
            </div>
          </div>

          {/* Main Demo Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div>
                <h2 className="text-2xl font-bold mb-2">Try It Yourself</h2>
                <p className="text-gray-600 mb-6">
                  Fill this demo form. Watch it create a real contact in HubSpot.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="How can we help?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {formStatus === 'submitting' ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Syncing...
                      </span>
                    ) : 'Test CRM Sync →'}
                  </button>

                  {/* Status Messages */}
                  {formStatus === 'success' && (
                    <div className="p-4 bg-green-100 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="font-bold text-green-800">Success! Contact created</p>
                          <p className="text-sm text-green-600">Check your HubSpot demo account</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {formStatus === 'error' && (
                    <div className="p-4 bg-yellow-100 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <p className="font-bold text-yellow-800">Demo mode active</p>
                          <p className="text-sm text-yellow-600">
                            Contact me to see the fully working version
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Column - Visual Explanation */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">⚡ How It Works</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">1</div>
                    <div>
                      <p className="font-medium">You fill this form</p>
                      <p className="text-sm text-gray-600">Just like your business forms</p>
                    </div>
                  </div>
                  <div className="pl-3 text-gray-400">↓</div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">2</div>
                    <div>
                      <p className="font-medium">n8n automation triggers</p>
                      <p className="text-sm text-gray-600">My workflow processes your data</p>
                    </div>
                  </div>
                  <div className="pl-3 text-gray-400">↓</div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">3</div>
                    <div>
                      <p className="font-medium">HubSpot API creates contact</p>
                      <p className="text-sm text-gray-600">Appears instantly - no manual entry</p>
                    </div>
                  </div>

                  {/* Time savings */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium mb-2">Time saved per submission:</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4 bg-red-200 rounded-l-full flex items-center justify-start text-xs text-red-800 pl-2">
                        Manual: 5-10 mins
                      </div>
                      <div className="flex-1 h-4 bg-green-500 rounded-r-full flex items-center justify-end text-xs text-white pr-2">
                        Auto: 0 sec
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Built With</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { emoji: '📝', name: 'Google Forms', desc: 'Form capture' },
                { emoji: '⚡', name: 'n8n', desc: 'Automation' },
                { emoji: '🔄', name: 'HubSpot API', desc: 'CRM integration' },
                { emoji: '🚀', name: 'Next.js', desc: 'Your demo page' }
              ].map((item) => (
                <div key={item.name} className="text-center">
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section - matches your site's style */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Want This For Your Business?</h2>
            <p className="text-xl mb-6 opacity-90">
              Stop manually entering leads. Let's connect your forms to your CRM.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Discuss Your Project →
            </a>
          </div>
        </div>
      </main>
    </>
  );
}