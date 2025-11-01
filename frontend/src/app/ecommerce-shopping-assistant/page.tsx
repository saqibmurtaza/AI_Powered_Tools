"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export default function EcommerceShoppingAssistantPage() {
  const features = [
    {
      title: "Personalized Product Discovery",
      description: "AI-powered recommendations based on customer preferences and behavior"
    },
    {
      title: "24/7 Customer Support",
      description: "Instant answers to product questions, shipping, and return policies"
    },
    {
      title: "Smart Cart Management",
      description: "Helps customers manage their shopping cart and apply promotions"
    },
    {
      title: "Lead Generation",
      description: "Captures potential customers and connects with marketing automation"
    },
    {
      title: "Cross-selling & Up-selling",
      description: "Intelligently suggests complementary products and upgrades"
    },
    {
      title: "Order Tracking",
      description: "Provides real-time order status and shipping updates"
    }
  ];

  const benefits = [
    "Increase conversion rates by 30% with personalized assistance",
    "Reduce cart abandonment by 25% with instant support",
    "Generate qualified leads 24/7 without additional staff",
    "Boost average order value with smart recommendations",
    "Provide consistent customer experience across all channels"
  ];

  return (
    <div className="min-h-screen bg-white font-poppins text-[var(--brand)]">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24 text-center bg-gradient-to-br from-blue-50 to-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
              E-Commerce Shopping Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Boost sales and engagement with AI-powered shopping guidance and personalized recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://saqibmurtaza-chainlit-shopping-agent.hf.space"
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
              Advanced E-Commerce Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform your online store with intelligent shopping assistance
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
              Drive E-Commerce Growth
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
        <section className="py-16 px-6 md:px-12 lg:px-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4">
              Experience the Future of Online Shopping
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              See how our AI assistant can transform your customer's shopping journey
            </p>
            <div className="bg-gradient-to-r from-[#4D0682] to-[#7C3AED] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Live Demo Available</h3>
              <p className="mb-6 opacity-90">
                Test our shopping assistant with sample products and experience the personalized recommendations firsthand
              </p>
              <a
                href="https://saqibmurtaza-chainlit-shopping-agent.hf.space"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-[#4D0682] font-semibold hover:bg-gray-100 transition-colors"
              >
                Launch Interactive Demo
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}