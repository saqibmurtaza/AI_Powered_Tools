// // frontend/src/app/components/ToolCard.tsx
// import React from 'react';

// type Props = {
//   icon: React.ComponentType<any>;
//   title: string;
//   description: string;
//   href?: string;
// };

// export default function ToolCard({ icon: Icon, title, description, href }: Props) {
//   return (
//     <a href={href || '#'} className="tool-card block bg-white shadow-sm hover:shadow-subtle transition-all">
//       <div className="card-top flex items-center justify-center">
//         <Icon className="text-white h-10 w-10" />
//       </div>
//       <div className="card-body">
//         <h3 className="text-lg font-semibold mb-2">{title}</h3>
//         <p className="text-sm text-gray-600">{description}</p>
//       </div>
//     </a>
//   );
// }


// ./src/components/ToolCard.tsx
import React from 'react';

// Use a specific type for the icon component that includes standard SVG props.
type Props = {
  // Fix: Replaced 'any' with React.SVGProps<SVGSVGElement> to correctly type the component's props.
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  href?: string;
};

// Destructure icon as 'Icon' for JSX usage
export default function ToolCard({ icon: Icon, title, description, href }: Props) {
  return (
    // Note: Updated class names to be more common/semantic for clarity.
    <a 
      href={href || '#'} 
      className="tool-card block bg-white shadow-sm hover:shadow-subtle transition-all"
    >
      <div className="card-top flex items-center justify-center">
        {/* Pass standard props (like className) to the Icon component */}
        <Icon className="text-white h-10 w-10" />
      </div>
      <div className="card-body">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </a>
  );
}