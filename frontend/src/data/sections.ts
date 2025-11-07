// frontend/src/data/sections.ts
export const siteData = {
  toolwiz: {
    title: "SMTools — Useful Online Tools",
    subtitle:
      "Free, easy-to-use online tools to simplify your digital tasks and improve productivity",
    tools: [
      {
        id: "contextcards",
        name: "MemorAI Cards",
        link: "/tools/contextcards", // ✅ Already correct
        description: "Your Second Brain for Everything You Read — AI that captures, summarizes, and remembers what matters",
        icon: "🧩",
      },
      {
        id: "agecalculator",
        name: "Age Calculator",
        link: "/tools/age-calculator", // ✅ Fixed: changed from "/age-calculator" to "/tools/age-calculator"
        description: "Accurate age calculator with time and date precision.",
        icon: "🧮",
      },
      // future tools: just add objects here and they appear across site.
      {
        id: "textanalyzer",
        name: "Text Analyzer",
        link: "/tools/text-analyzer",
        description: "Analyze and process text content with AI.",
        icon: "📊",
      },
      {
        id: "unitconverter", 
        name: "Unit Converter",
        link: "/tools/unit-converter",
        description: "Convert between different units and measurements.",
        icon: "📏",
      },
    ],
  },

  smbotics: {
    title: "SMBotics - AI Chatbots for Business",
    tagline: "Intelligent chatbot solutions designed to automate customer service, boost engagement, and drive growth for small and medium businesses.",
    bots: [
      {
        name: "Salon Booking Assistant",
        description: "AI-powered appointment scheduling and customer service for salons. Streamline bookings, reduce no-shows, and enhance client experience.",
        icon: "💇",
        link: "/salon-booking-assistant" // Updated to internal page
      },
      {
        name: "E-Commerce Shopping Assistant",
        description: "Boost sales with personalized product recommendations and 24/7 customer support. Increase conversions and customer satisfaction.",
        icon: "🛒",
        link: "/ecommerce-shopping-assistant" // Updated to internal page
      },
      {
        name: "Student AI Chatbot",
        description: "24/7 academic support with instant answers, curated resources, and educational videos. Perfect for students and educational institutions.",
        icon: "🎓",
        link: "/student-ai-chatbot" // Updated to internal page
      }
    ]
  }
};