// frontend/src/app/tools/[toolId]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteData } from '@/data/sections';
import dynamic from 'next/dynamic';

// Dynamically import tool components
const toolComponents = {
  agecalculator: dynamic(() => import('../tenure-calculator/page')),
  contextcards: dynamic(() => import('../contextcards/ClientPage')),
  checktop: dynamic(() => import('../checktop/page')),
  // Add new tools here as they're built
} as const;

interface PageProps {
  params: {
    toolId: string;
  };
}

export default function ToolPage({ params }: PageProps) {
  const tool = siteData.toolwiz.tools.find(t => t.id === params.toolId);
  
  if (!tool) {
    notFound();
  }

  const ToolComponent = toolComponents[params.toolId as keyof typeof toolComponents];

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Header - same as before */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <span className="text-2xl">{tool.icon}</span>
            <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
          </div>
        </div>
      </header>

      {/* Tool Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {ToolComponent ? (
          <ToolComponent />
        ) : (
          // Show coming soon for tools without components
          <div className="text-center py-12 bg-gray-50 rounded-2xl border">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This tool is currently under development.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Generate static params
export async function generateStaticParams() {
  return siteData.toolwiz.tools.map((tool) => ({
    toolId: tool.id,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const tool = siteData.toolwiz.tools.find(t => t.id === params.toolId);
  
  return {
    title: tool ? `${tool.name} - SMTools` : 'Tool Not Found',
    description: tool?.description,
  };
}