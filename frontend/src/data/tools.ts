// frontend/src/data/tools.ts
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: string;
  status: 'active' | 'coming-soon';
}

export const tools: Tool[] = [
  {
    id: "context-cards",
    name: "Context Cards", 
    description: "Create and manage context cards for better organization",
    icon: "📋",
    href: "/tools/contextcards",
    category: "productivity",
    status: "active"
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age between dates",
    icon: "📅",
    href: "/tools/age-calculator",
    category: "calculators",
    status: "active"
  },
  {
    id: "text-analyzer",
    name: "Text Analyzer",
    description: "Analyze and process text content",
    icon: "📊",
    href: "/tools/text-analyzer", 
    category: "text",
    status: "coming-soon"
  },
  // Add more tools here matching your current ones
];