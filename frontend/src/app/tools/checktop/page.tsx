"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Download, Battery, Cpu, HardDrive, Monitor, Headphones, Activity, CheckCircle, Shield, Wifi, Zap } from 'lucide-react';

export default function CheckTopPage() {
  const [downloaded, setDownloaded] = useState(false);

  const features = [
    {
      icon: <Battery className="w-6 h-6" />,
      title: "🔋 Battery Health",
      description: "Detects weak or degraded batteries with cycle count and wear level analysis"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "⚡ CPU & Performance", 
      description: "Identifies throttling, overheating, and benchmarks real-world performance"
    },
    {
      icon: <HardDrive className="w-6 h-6" />,
      title: "💾 Storage Health",
      description: "Checks drive condition, remaining lifespan, and free space analysis"
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "🖥️ Display Issues",
      description: "Identifies dead pixels, backlight bleeding, and screen uniformity problems"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "🔌 Ports & Audio",
      description: "Verifies USB ports, HDMI output, speakers, and microphone functionality"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "📊 Overall Verdict",
      description: "Clear GOOD / FAIR / POOR assessment with detailed recommendations"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Download",
      description: "Download the CheckTop Agent (5MB) - takes less than 1 minute"
    },
    {
      number: "2", 
      title: "Run",
      description: "Double-click the downloaded file to run diagnostics"
    },
    {
      number: "3",
      title: "Get Report",
      description: "View your complete health report in 2 minutes"
    }
  ];

  const handleDownload = () => {
    // Trigger download and show feedback
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      {/* Header */}
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
            <Zap className="w-6 h-6 text-[#4D0682]" />
            <h1 className="text-2xl font-bold text-gray-900">CheckTop - Laptop Diagnostic Tool</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🖥️</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">CheckTop</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Laptop Health Check Before You Buy or Sell
          </p>
        </div>

        {/* Download Card */}
        {/* Download Card - UPDATE THIS SECTION */}
        <div className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-2xl p-8 text-white mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Download & Run Diagnostics</h2>
            <p className="text-white/90 mb-8">
              Download the CheckTop Agent, run it, and get your complete laptop health report in 2 minutes
            </p>
            
            {/* CHANGE THIS LINK */}
            <a 
              href="https://github.com/saqibmurtaza/CheckTop_Diagnostic/releases/tag/v1.0.0"
              target="_blank"  // Opens in new tab
              rel="noopener noreferrer"  // Security best practice
              onClick={handleDownload}
              className="inline-flex items-center gap-3 bg-white text-[#4D0682] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg mb-4"
            >
              <Download className="w-5 h-5" />
              ⬇️ Download CheckTop Agent (Windows)
            </a>
            
            {downloaded && (
              <div className="mt-4 text-green-300 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Redirecting to GitHub download page...
              </div>
            )}
            
            <p className="text-white/80 text-sm mt-4">
              Windows 10 / 11 • 5 MB • Takes less than 1 minute
            </p>
          </div>
        </div>

        {/* Add this after the download card */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500">
            📦 Download hosted on{' '}
            <a 
              href="https://github.com/saqibmurtaza/CheckTop_Diagnostic" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#4D0682] hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step) => (
            <div key={step.number} className="bg-gray-50 rounded-xl p-6 border text-center">
              <div className="w-12 h-12 bg-[#4D0682] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Privacy Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-12 flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">
            ✓ Runs completely offline • No data sent to cloud • Your privacy is guaranteed
          </p>
        </div>

        {/* What CheckTop Checks */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What CheckTop Checks</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
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

        {/* Why Use CheckTop */}
        <div className="bg-gray-50 rounded-2xl p-8 border mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Use CheckTop?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Buy With Confidence</h3>
              <p className="text-sm text-gray-600">Test any laptop before purchase to avoid hidden problems</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-900 mb-2">Sell With Trust</h3>
              <p className="text-sm text-gray-600">Generate verified reports to prove your laptop's condition</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border text-center">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-semibold text-gray-900 mb-2">Maintain Better</h3>
              <p className="text-sm text-gray-600">Catch issues early and keep your laptop healthy longer</p>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-300 mb-2">Minimum</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Windows 10 (64-bit)</li>
                <li>• 4GB RAM</li>
                <li>• 100MB free disk space</li>
                <li>• Internet connection (only for download)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300 mb-2">Recommended</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Windows 11</li>
                <li>• 8GB+ RAM</li>
                <li>• SSD with 1GB+ free space</li>
                <li>• Runs completely offline after download</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Is CheckTop really free?</h3>
              <p className="text-sm text-gray-600">Yes! CheckTop is completely free to use with no hidden costs or premium tiers.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Does it send my data anywhere?</h3>
              <p className="text-sm text-gray-600">No. CheckTop runs completely offline. Your diagnostic data never leaves your computer.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Can I use it on Mac or Linux?</h3>
              <p className="text-sm text-gray-600">Currently Windows only. Mac and Linux versions are in development.</p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">How accurate is the battery health check?</h3>
              <p className="text-sm text-gray-600">Very accurate. It reads the actual battery controller data including cycle count, design capacity, and current capacity.</p>
            </div>
          </div>
        </div>
        {/* Add near the bottom of your component */}
        <div className="mt-8 text-center border-t pt-8">
          <p className="text-sm text-gray-500">
            Prefer the dedicated site? Visit{' '}
            <a 
              href="https://checktop-frontend.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#4D0682] hover:underline"
            >
              CheckTop standalone version
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}