// // frontend/src/app/tools/age-calculator/page.tsx
// "use client";

// import { useState } from 'react';
// import Link from 'next/link';
// import { ArrowLeft } from 'lucide-react';

// export default function AgeCalculatorPage() {
//   const [birthDate, setBirthDate] = useState('');
//   const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

//   const calculateAge = () => {
//     if (!birthDate) return;

//     const birth = new Date(birthDate);
//     const today = new Date();
    
//     let years = today.getFullYear() - birth.getFullYear();
//     let months = today.getMonth() - birth.getMonth();
//     let days = today.getDate() - birth.getDate();

//     if (days < 0) {
//       months--;
//       const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
//       days += prevMonth.getDate();
//     }

//     if (months < 0) {
//       years--;
//       months += 12;
//     }

//     setAge({ years, months, days });
//   };

//   return (
//     <div className="min-h-screen bg-white font-poppins">
//       {/* Header */}
//       <header className="border-b">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/"
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Tools
//             </Link>
//             <div className="w-px h-6 bg-gray-300"></div>
//             <span className="text-2xl">🧮</span>
//             <h1 className="text-2xl font-bold text-gray-900">Age Calculator</h1>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-6 py-12">
//         <div className="text-center mb-12">
//           <div className="text-6xl mb-4">🧮</div>
//           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Age Calculator</h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Calculate your exact age in years, months, and days
//           </p>
//         </div>
        
//         <div className="bg-gray-50 rounded-2xl p-8 border max-w-md mx-auto">
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Date of Birth
//               </label>
//               <input
//                 type="date"
//                 value={birthDate}
//                 onChange={(e) => setBirthDate(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               />
//             </div>
            
//             <button
//               onClick={calculateAge}
//               className="w-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//             >
//               Calculate Age
//             </button>

//             {age && (
//               <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
//                 <h3 className="text-lg font-semibold mb-2 text-gray-900">Your Age:</h3>
//                 <p className="text-2xl text-gray-900 font-bold">
//                   {age.years} years, {age.months} months, {age.days} days
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// frontend/src/app/tools/age-calculator/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Calendar, Target, Zap } from 'lucide-react';

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });
  };

  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Precise Calculations",
      description: "Get exact age in years, months, and days with accurate date handling including leap years."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Results",
      description: "Calculate your age instantly with real-time updates and no waiting time."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Multiple Use Cases",
      description: "Perfect for birthdays, anniversaries, project timelines, and legal documentation."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Date Intelligence",
      description: "Smart handling of different month lengths and calendar variations for complete accuracy."
    }
  ];

  const benefits = [
    {
      title: "For Personal Use",
      items: ["Track birthdays and anniversaries", "Calculate age for fitness goals", "Plan milestone celebrations"]
    },
    {
      title: "For Professional Use", 
      items: ["Verify age for legal documents", "Calculate project durations", "Track employee service periods"]
    },
    {
      title: "For Academic Use",
      items: ["Calculate age for research", "Track historical timelines", "Educational date calculations"]
    }
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
              Back to Tools
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-2xl">🧮</span>
            <h1 className="text-2xl font-bold text-gray-900">Age Calculator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Calculator Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🧮</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Age Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your exact age in years, months, and days
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Calculator Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-8 border h-full">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={calculateAge}
                  className="w-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Calculate Age
                </button>

                {age && (
                  <div className="mt-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 text-center">Your Age</h3>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-gray-900">
                        {age.years} <span className="text-sm font-normal text-gray-600">years</span>
                      </div>
                      <div className="text-xl text-gray-700">
                        {age.months} <span className="text-sm text-gray-600">months</span>
                      </div>
                      <div className="text-lg text-gray-600">
                        {age.days} <span className="text-sm">days</span>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Use Our Age Calculator?</h2>
              
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

        {/* Benefits Section */}
        <div className="bg-gray-50 rounded-2xl p-8 border mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Practical Applications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:transform hover:-translate-y-1"
              >
                <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-full mr-3"></div>
                  {benefit.title}
                </h3>
                <ul className="space-y-2">
                  {benefit.items.map((item, itemIndex) => (
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

        {/* How It Works Section */}
        <div className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">1</div>
              <h3 className="font-semibold">Enter Date</h3>
              <p className="text-white/80 text-sm">Select your birth date using the date picker</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">2</div>
              <h3 className="font-semibold">Calculate</h3>
              <p className="text-white/80 text-sm">Click the calculate button to process</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">3</div>
              <h3 className="font-semibold">Get Results</h3>
              <p className="text-white/80 text-sm">View your exact age in years, months, days</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-lg font-bold">4</div>
              <h3 className="font-semibold">Use Anywhere</h3>
              <p className="text-white/80 text-sm">Perfect for personal, professional, or academic use</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}