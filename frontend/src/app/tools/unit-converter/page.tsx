// frontend/src/app/tools/unit-converter/page.tsx
import Link from 'next/link';
import { ArrowLeft, Ruler, Zap, Globe, Clock, Calculator } from 'lucide-react';

export default function UnitConverterPage() {
  const conversionTypes = [
    {
      icon: <Ruler className="w-6 h-6" />,
      title: "Length & Distance",
      units: ["Meters, Feet, Inches", "Kilometers, Miles", "Centimeters, Millimeters"]
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Weight & Mass",
      units: ["Kilograms, Pounds", "Grams, Ounces", "Metric Tons, US Tons"]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Temperature",
      units: ["Celsius, Fahrenheit", "Kelvin", "All major scales"]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Digital Storage",
      units: ["Bytes, Kilobytes", "Megabytes, Gigabytes", "Terabytes, Petabytes"]
    }
  ];

  const additionalFeatures = [
    {
      title: "Real-time Conversion",
      description: "Instant results as you type with live updates"
    },
    {
      title: "100+ Unit Types", 
      description: "Comprehensive coverage of all major measurement systems"
    },
    {
      title: "Copy & Export",
      description: "Easy copying of results and export capabilities"
    },
    {
      title: "Mobile Optimized",
      description: "Works perfectly on all devices and screen sizes"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
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
            <span className="text-2xl">📏</span>
            <h1 className="text-2xl font-bold text-gray-900">Unit Converter</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">📏</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Unit Converter</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Convert between hundreds of units instantly. Length, weight, temperature, digital storage, and much more.
          </p>
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            Coming Soon
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Conversion Types */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Supported Conversions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {conversionTypes.map((type, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-lg flex items-center justify-center text-white">
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-3">{type.title}</h3>
                        <ul className="space-y-1">
                          {type.units.map((unit, unitIndex) => (
                            <li key={unitIndex} className="flex items-start text-sm text-gray-600">
                              <span className="text-[#7C3AED] mr-2">•</span>
                              {unit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Features */}
            <div className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6 text-center">Advanced Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {additionalFeatures.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-lg font-bold">{index + 1}</div>
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Conversions</h2>
              <div className="space-y-4">
                {[
                  "Miles → Kilometers",
                  "Pounds → Kilograms", 
                  "Fahrenheit → Celsius",
                  "Inches → Centimeters",
                  "Gallons → Liters",
                  "Bytes → Megabytes"
                ].map((conversion, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 text-sm">
                    <div className="font-medium text-gray-900">{conversion}</div>
                    <div className="text-gray-500 text-xs mt-1">Instant conversion</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notify Me Button */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mt-6 text-center">
              <Ruler className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Be the First to Know</h3>
              <p className="text-sm text-gray-600 mb-4">Get notified when Unit Converter is ready</p>
              <button className="w-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white py-2 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Coming Soon Progress */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Development in Progress
          </div>
        </div>
      </main>
    </div>
  );
}