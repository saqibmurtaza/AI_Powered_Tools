// // frontend/src/app/tools/[toolId]/page.tsx
// import { notFound } from 'next/navigation';
// import Link from 'next/link';
// import { ArrowLeft } from 'lucide-react';
// import { siteData } from '@/data/sections';

// interface PageProps {
//   params: {
//     toolId: string;
//   };
// }

// export default function ToolPage({ params }: PageProps) {
//   // Find the tool in our siteData
//   const tool = siteData.toolwiz.tools.find(t => t.id === params.toolId);
  
//   if (!tool) {
//     notFound();
//   }

//   return (
//     <div className="min-h-screen bg-white font-poppins">
//       {/* Header */}
//       <header className="border-b">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center gap-4">
//             <Link 
//               href="/"
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Tools
//             </Link>
//             <div className="w-px h-6 bg-gray-300"></div>
//             <span className="text-2xl">{tool.icon}</span>
//             <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
//           </div>
//         </div>
//       </header>

//       {/* Tool Content */}
//       <main className="max-w-7xl mx-auto px-6 py-12">
//         <div className="text-center mb-12">
//           <div className="text-6xl mb-4">{tool.icon}</div>
//           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{tool.name}</h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">{tool.description}</p>
//         </div>

//         {/* Tool-specific content area */}
//         <div className="bg-gray-50 rounded-2xl p-8 border">
//           {params.toolId === 'agecalculator' && (
//             <div className="max-w-md mx-auto">
//               <AgeCalculator />
//             </div>
//           )}
          
//           {/* For tools that don't have specific implementations yet */}
//           {!['contextcards', 'agecalculator'].includes(params.toolId) && (
//             <div className="text-center py-12">
//               <div className="text-4xl mb-4">🚧</div>
//               <h3 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
//               <p className="text-gray-600">This tool is currently under development.</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// // Age Calculator Component
// function AgeCalculator() {
//   return (
//     <div className="space-y-6">
//       <div className="text-center">
//         <h3 className="text-lg font-semibold mb-2">Calculate Your Age</h3>
//         <p className="text-gray-600">Enter your birthdate to see your exact age</p>
//       </div>
      
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Date of Birth
//           </label>
//           <input
//             type="date"
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>
        
//         <button className="w-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
//           Calculate Age
//         </button>
//       </div>
//     </div>
//   );
// }

// // Generate static params for better performance
// export async function generateStaticParams() {
//   return siteData.toolwiz.tools.map((tool) => ({
//     toolId: tool.id,
//   }));
// }

// // Generate metadata for SEO
// export async function generateMetadata({ params }: PageProps) {
//   const tool = siteData.toolwiz.tools.find(t => t.id === params.toolId);
  
//   return {
//     title: tool ? `${tool.name} - ToolWiz` : 'Tool Not Found',
//     description: tool?.description,
//   };
// }

// frontend/src/app/tools/[toolId]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { siteData } from '@/data/sections';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import ContextCards with no SSR
const ContextCardsClient = dynamic(() => import('./ContextCardsClient'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12">
      <div className="animate-pulse">Loading Context Cards...</div>
    </div>
  )
});

interface PageProps {
  params: {
    toolId: string;
  };
}

export default function ToolPage({ params }: PageProps) {
  // Find the tool in our siteData
  const tool = siteData.toolwiz.tools.find(t => t.id === params.toolId);
  
  if (!tool) {
    notFound();
  }

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
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{tool.icon}</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{tool.name}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{tool.description}</p>
        </div>

        {/* Tool-specific content area */}
        <div className="bg-gray-50 rounded-2xl p-8 border">
          {params.toolId === 'agecalculator' && (
            <div className="max-w-md mx-auto">
              <AgeCalculator />
            </div>
          )}
          
          {params.toolId === 'contextcards' && (
            <Suspense fallback={
              <div className="text-center py-12">
                <div className="animate-pulse">Loading Context Cards...</div>
              </div>
            }>
              <ContextCardsClient />
            </Suspense>
          )}
          
          {/* For tools that don't have specific implementations yet */}
          {!['contextcards', 'agecalculator'].includes(params.toolId) && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">This tool is currently under development.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Age Calculator Component
function AgeCalculator() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Calculate Your Age</h3>
        <p className="text-gray-600">Enter your birthdate to see your exact age</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <button className="w-full bg-gradient-to-r from-[#4D0682] to-[#7C3AED] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Calculate Age
        </button>
      </div>
    </div>
  );
}

// Generate static params for better performance
export async function generateStaticParams() {
  return siteData.toolwiz.tools.map((tool) => ({
    toolId: tool.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const tool = siteData.toolwiz.tools.find(t => t.id === params.toolId);
  
  return {
    title: tool ? `${tool.name} - ToolWiz` : 'Tool Not Found',
    description: tool?.description,
  };
}