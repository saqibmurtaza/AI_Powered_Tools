"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export default function StudentAIChatbotPage() {
  const features = [
    {
      title: "Instant Academic Support",
      description: "Get immediate answers to course-related questions and concepts"
    },
    {
      title: "Curated Learning Resources",
      description: "Access personalized educational materials and reference links"
    },
    {
      title: "24/7 Study Companion",
      description: "Available round-the-clock for homework help and exam preparation"
    },
    {
      title: "Video Resource Library",
      description: "Discover relevant educational videos and tutorials"
    },
    {
      title: "Research Assistance",
      description: "Help with finding sources and understanding complex topics"
    },
    {
      title: "Progress Tracking",
      description: "Monitor learning progress and identify areas for improvement"
    }
  ];

  const benefits = [
    "Save 10+ hours weekly on research and study time",
    "Improve understanding with instant explanations",
    "Access curated educational content anytime",
    "Enhance learning outcomes with personalized support",
    "Reduce stress with reliable academic assistance"
  ];

  return (
    <div className="min-h-screen bg-white font-poppins text-[var(--brand)]">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24 text-center bg-gradient-to-br from-green-50 to-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
              Student AI Chatbot
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your personal AI study companion - instant answers, curated resources, and 24/7 academic support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://saqibmurtaza-student-ai-chatbot.hf.space"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Try Live Demo
              </a>
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4">
              Comprehensive Learning Support
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything students need to excel in their academic journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <CardTitle className="text-lg text-black mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black text-center mb-12">
              Academic Excellence Made Easier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4">
                Experience Smart Learning
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our AI chatbot understands student needs and provides targeted support across various subjects and educational levels.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ask questions about any subject
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Get curated video resources
                </li>
                <li className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Receive study recommendations
                </li>
              </ul>
              <a
                href="https://saqibmurtaza-student-ai-chatbot.hf.space"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Start Learning with AI
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#4D0682] to-[#7C3AED] rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Perfect For:</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <span className="font-bold">📚</span>
                  </div>
                  <span>High School & College Students</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <span className="font-bold">🎓</span>
                  </div>
                  <span>University Researchers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <span className="font-bold">💡</span>
                  </div>
                  <span>Lifelong Learners</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <span className="font-bold">⏱️</span>
                  </div>
                  <span>Busy Students Needing Quick Help</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}