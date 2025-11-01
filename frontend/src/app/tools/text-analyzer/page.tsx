// frontend/src/app/tools/text-analyzer/page.tsx
import Link from 'next/link';
import { ArrowLeft, FileText, BarChart3, Zap, Clock, Target } from 'lucide-react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TextAnalyzerPage() {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Get detailed insights into word count, character count, reading time, and more."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Leverage artificial intelligence to analyze sentiment, tone, and readability."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Keyword Analysis",
      description: "Identify key phrases, topics, and semantic patterns in your text."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Processing",
      description: "Instant analysis with live updates as you type or paste text."
    }
  ];

  const useCases = [
    {
      category: "For Writers",
      items: ["Improve readability", "Check grammar and style", "Optimize content length"]
    },
    {
      category: "For Students", 
      items: ["Analyze essay structure", "Check plagiarism indicators", "Improve academic writing"]
    },
    {
      category: "For Professionals",
      items: ["Optimize business documents", "Analyze customer feedback", "Improve communication"]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/tools"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-2xl">📊</span>
            <h1 className="text-2xl font-bold text-gray-900">Text Analyzer</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Text Analyzer</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Advanced text analysis powered by AI. Get deep insights into your content&apos;s structure, sentiment, and readability.
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Coming Soon
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Features Grid */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Powerful Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-lg flex items-center justify-center text-white">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6 text-center">How It Will Work</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">1</div>
                  <h3 className="font-semibold">Input Text</h3>
                  <p className="text-white/80 text-sm">Paste or type your text into the analyzer</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">2</div>
                  <h3 className="font-semibold">AI Analysis</h3>
                  <p className="text-white/80 text-sm">Our AI processes and analyzes your content</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">3</div>
                  <h3 className="font-semibold">Get Insights</h3>
                  <p className="text-white/80 text-sm">Receive detailed analytics and suggestions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Use Cases */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Perfect For</h2>
              <div className="space-y-6">
                {useCases.map((useCase, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-4 border border-gray-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-full mr-2"></div>
                      {useCase.category}
                    </h3>
                    <ul className="space-y-1">
                      {useCase.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start text-xs text-gray-600">
                          <span className="text-[#7C3AED] mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Notify Me Button */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mt-6 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">Get notified when Text Analyzer launches</p>
              <button className="w-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}