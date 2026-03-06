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
    id: "checktop",
    name: "CheckTop Laptop Diagnostic",
    description: "Test laptop health before buying or selling. Checks battery, CPU, storage, display, ports & audio.",
    icon: "🖥️",
    href: "/tools/checktop",
    category: "utilities",
    status: "active"
  },
  {
    id: "tenure-calculator",
    name: "Work Tenure Calculator",
    description: "Calculate exact work tenure, years of service, and professional experience.",
    icon: "📅",
    href: "/tools/tenure-calculator",
    category: "calculators",
    status: "active"
  },
 
// Add more tools here matching your current ones
];