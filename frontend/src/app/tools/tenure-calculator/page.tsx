// frontend/src/app/tools/tenure-calculator/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Briefcase, Clock, FileText, ShieldCheck, TrendingUp } from 'lucide-react';

export default function TenureCalculatorPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [tenure, setTenure] = useState<{ years: number; months: number; days: number; totalDays: number } | null>(null);

  const calculateTenure = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      alert("Start date cannot be after end date.");
      return;
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    setTenure({ years, months, days, totalDays });
  };

  const features = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Employment Verification",
      description: "Accurately calculate years of service for HR audits, pension eligibility, and resume building."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Project Durations",
      description: "Measure the exact length of long-term projects or contract engagements with precision."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Seniority Tracking",
      description: "Determine organizational seniority for promotions, benefits, and internal restructuring."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Legal Compliance",
      description: "Ensure service period accuracy for severance calculations and labor law requirements."
    }
  ];

  const applications = [
    {
      title: "Human Resources",
      items: ["Service award eligibility", "Leave balance accrual", "Onboarding/Offboarding stats"]
    },
    {
      title: "Project Management", 
      items: ["Historical timeline analysis", "Vendor contract duration", "Resource allocation planning"]
    },
    {
      title: "Legal & Finance",
      items: ["Severance pay estimation", "Vesting period tracking", "Tax residency durations"]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      <Header />
      
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-2xl">💼</span>
            <h1 className="text-2xl font-bold text-gray-900">Tenure Calculator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Work Tenure Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate exact length of service, project durations, or professional experience in seconds.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Input Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 border h-full">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date (Joining Date)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (or Today)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={calculateTenure}
                  className="w-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Calculate Tenure
                </button>

                {tenure && (
                  <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 text-center border-b pb-2">Result</h3>
                    <div className="text-center space-y-3">
                      <div className="text-3xl font-bold text-gray-900">
                        {tenure.years} <span className="text-sm font-normal text-gray-600">years</span>
                      </div>
                      <div className="text-xl text-gray-700">
                        {tenure.months} <span className="text-sm text-gray-600">months</span>
                      </div>
                      <div className="text-lg text-gray-600">
                        {tenure.days} <span className="text-sm">days</span>
                      </div>
                      <div className="pt-3 mt-3 border-t border-gray-100">
                         <p className="text-xs uppercase text-gray-400 font-bold">Total Days</p>
                         <p className="text-xl font-semibold text-[#4D0682]">{tenure.totalDays.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Industry-Grade Precision</h2>
              
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
          </div>
        </div>

        {/* Industry Applications Section */}
        <div className="bg-gray-50 rounded-2xl p-8 border mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Professional Use Cases</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {applications.map((app, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:transform hover:-translate-y-1"
              >
                <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-full mr-3"></div>
                  {app.title}
                </h3>
                <ul className="space-y-2">
                  {app.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                      <span className="text-[#7C3AED] mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Branding */}
        <div className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Smart Tools for Modern Professionals</h2>
          <p className="text-white/80 text-sm max-w-2xl mx-auto">
            Whether you&apos;re calculating years of service for a retirement plan or measuring a project&apos;s timeline, our tenure calculator provides the accurate data you need for your documentation.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

