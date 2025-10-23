// frontend/src/data/sections.ts
export const siteData = {
  toolwiz: {
    title: "ToolWiz — Useful Online Tools",
    subtitle:
      "Free, easy-to-use online tools to simplify your digital tasks and improve productivity",
    tools: [
      {
        id: "contextcards",
        name: "Context Cards",
        link: "/tools/contextcards", // ✅ Already correct
        description: "AI-powered contextual note cards for productivity.",
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
    title: "SMBotics — AI Agents that Automate and Engage",
    tagline:
      "Custom conversational agents designed to automate customer interactions, boost engagement, and personalize user experiences.",
    bots: [
      {
        name: "Shopping Agent",
        link: "https://saqibmurtaza-chainlit-shopping-agent.hf.space/",
        description: "Helps customers explore products and recover abandoned carts.",
        icon: "🛍️",
      },
      {
        name: "Student AI Chatbot",
        link: "https://saqibmurtaza-student-ai-chatbot.hf.space/",
        description: "Assists students with academic planning and learning support.",
        icon: "🎓",
      },
      {
        name: "Salon Booking Bot (UK)",
        link: "https://asuno-salon-england.onrender.com",
        description: "Automates salon bookings and enhances client communication.",
        icon: "💇‍♀️",
      },
      // future bots go here
    ],
  },
};