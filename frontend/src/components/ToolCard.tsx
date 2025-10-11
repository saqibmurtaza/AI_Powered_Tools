// frontend/src/app/components/ToolCard.tsx
import React from 'react';

type Props = {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  href?: string;
};

export default function ToolCard({ icon: Icon, title, description, href }: Props) {
  return (
    <a href={href || '#'} className="tool-card block bg-white shadow-sm hover:shadow-subtle transition-all">
      <div className="card-top flex items-center justify-center">
        <Icon className="text-white h-10 w-10" />
      </div>
      <div className="card-body">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </a>
  );
}
