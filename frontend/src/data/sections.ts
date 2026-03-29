// frontend/src/data/sections.ts
export const siteData = {
  toolwiz: {
    title: "SMTools — Smart Digital Tools",
    subtitle:
      "Free, easy-to-use online tools to simplify your digital tasks and improve productivity",
    tools: [
      {
        id: "contextcards",
        name: "MemorAI Cards",
        link: "/tools/contextcards", // ✅ Already correct
        description: "MemorAI Cards are like digital sticky notes for your AI assistant.\nYou write down things that matter to you, like your goals, preferences, and what you are learning.\nThe AI reads them when you chat, so it remembers your context and helps you more naturally, like a helpful friend who never forgets.",
        icon: "🧩",
      },
      {
        id: "checktop",
        name: "CheckTop Laptop Diagnostic",
        link: "/tools/checktop",
        description: "Test any laptop's health before buying or selling. Runs completely offline with detailed hardware reports.",
        icon: "🖥️",
      },
      {
        id: "tenurecalculator",
        name: "Work Tenure Calculator",
        link: "/tools/tenure-calculator", // ✅ Fixed: changed from "/tenure-calculator" to "/tools/tenure-calculator"
        description: "Determine exact service duration for HR analytics and career planning",
        icon: "🧮",
      },
      {
        id: "crm-automation",
        name: "CRM Automation",
        link: "/tools/crm-automation",
        description: "Your AI-powered assistant for managing customers and leads.\nWhen someone fills out a form on your website, the information automatically goes straight into your CRM — no copying, no pasting, no mistakes. \nYour AI organizes everything, tags leads by interest, and even assigns follow-ups to the right person. Never lose track of a customer again. Just focus on growing your business.",
        icon: "🤖",
      },
      // future tools: just add objects here and they appear across site.
      
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
