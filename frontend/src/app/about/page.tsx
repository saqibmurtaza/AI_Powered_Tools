// frontend/src/app/about/page.tsx
import Link from 'next/link';
import { ArrowLeft, Users, Target, Rocket, Heart } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Our Mission",
      description: "To create intuitive, powerful tools that simplify digital tasks and enhance productivity for everyone."
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Innovation",
      description: "Constantly pushing boundaries with AI-powered solutions and cutting-edge technology."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "User-First",
      description: "Every tool is designed with our users' needs at the forefront of development."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Building a community of creators, developers, and productivity enthusiasts."
    }
  ];

  const stats = [
    { number: "10K+", label: "Users Served" },
    { number: "25+", label: "Tools Developed" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
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
            <span className="text-2xl">🌟</span>
            <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About Digital SM Studio</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about creating tools that make digital life simpler, smarter, and more productive. 
            Our journey began with a simple goal: to build solutions that actually help people.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Digital SM Studio started as a passion project—a collection of tools we built to solve our own daily challenges. 
                We noticed that many online tools were either too complex, too expensive, or filled with unnecessary features.
              </p>
              <p className="text-gray-600 mb-4">
                So we decided to create something different: clean, focused tools that do one thing exceptionally well. 
                Tools that are free to use, easy to understand, and powerful enough for professionals.
              </p>
              <p className="text-gray-600">
                Today, we're growing rapidly, but our core philosophy remains the same: 
                build tools we're proud to use ourselves, and make them available to everyone.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Join Our Journey</h3>
              <p className="text-gray-600 text-sm">
                We're just getting started. There's so much more to build, and we'd love for you to be part of our journey.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Explore Our Tools
          </Link>
        </div>
      </main>
    </div>
  );
}
