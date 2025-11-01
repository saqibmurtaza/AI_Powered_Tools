"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export default function SalonBookingAssistantPage() {
  const features = [
    {
      title: "Automated Appointment Scheduling",
      description: "Let customers book appointments 24/7 without human intervention"
    },
    {
      title: "Smart Calendar Management",
      description: "Syncs with your booking system to show real-time availability"
    },
    {
      title: "Customer Query Handling",
      description: "Answers common questions about services, pricing, and availability"
    },
    {
      title: "Reminder System",
      description: "Automatically sends appointment confirmations and reminders"
    },
    {
      title: "Multi-service Support",
      description: "Handles bookings for various salon services and staff members"
    },
    {
      title: "Customer Experience Enhancement",
      description: "Provides instant responses and reduces wait times"
    }
  ];

  const benefits = [
    "Reduce no-shows by 40% with automated reminders",
    "Save 15+ hours weekly on administrative tasks",
    "Increase bookings by 25% with 24/7 availability",
    "Improve customer satisfaction with instant responses",
    "Streamline front desk operations efficiently"
  ];

  return (
    <div className="min-h-screen bg-white font-poppins text-[var(--brand)]">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24 text-center bg-gradient-to-br from-purple-50 to-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
              Salon Booking Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your salon&apos;s front desk with AI-powered appointment management and customer service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://asuno-salon-england.onrender.com"
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
              Powerful Features for Modern Salons
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your salon operations and enhance customer experience
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
              Measurable Business Benefits
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

        {/* CTA Section */}
        <section className="py-16 px-6 md:px-12 lg:px-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4">
              Ready to Transform Your Salon?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Experience the future of salon management with our AI assistant
            </p>
            <a
              href="https://asuno-salon-england.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white font-semibold hover:opacity-90 transition-opacity text-lg"
            >
              Start Free Demo
            </a>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}