// frontend/src/app/tools/page.tsx
import Link from 'next/link';
import { siteData } from '@/data/sections';
import { ArrowLeft, Zap, Cpu, Sparkles } from 'lucide-react';

export default function ToolsPage() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered",
      description: "Leveraging artificial intelligence to enhance your productivity and simplify complex tasks."
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Fast & Efficient",
      description: "Lightning-fast tools that deliver instant results without compromising on accuracy."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "User-Friendly",
      description: "Intuitive interfaces designed for both beginners and power users."
    }
  ];

  const upcomingTools = [
    "Text Analyzer", "Unit Converter", "JSON Formatter", "Color Picker", 
    "Password Generator", "QR Code Creator", "Markdown Editor", "File Converter"
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-2xl">🛠️</span>
            <h1 className="text-2xl font-bold text-gray-900">All Tools</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🛠️</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Digital SM Studio Tools</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our collection of powerful, AI-enhanced tools designed to boost your productivity
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow duration-200"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-lg flex items-center justify-center text-white mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Available Tools Section */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Available Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteData.toolwiz.tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.link}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:transform hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{tool.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#7C3AED] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Coming Soon</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {upcomingTools.map((tool, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-sm font-medium">{tool}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-white/80 mt-6 text-sm">
            We're constantly working on new tools to enhance your workflow
          </p>
        </div>
      </main>
    </div>
  );
}
