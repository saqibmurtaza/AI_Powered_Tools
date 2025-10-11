// // CustomCard.tsx (Server Component, but accepts component prop)
// import React from 'react';
// import { ACCENT_COLOR_CLASS, TEXT_COLOR_CLASS, SUBTLE_SHADOW_CLASS } from '../lib/gemini';

// interface CustomCardProps {
//     icon: React.ElementType; // Icon component type
//     title: string;
//     description: string;
// }

// const CustomCard: React.FC<CustomCardProps> = ({ icon: Icon, title, description }) => (
//     <div className={`p-6 ${TEXT_COLOR_CLASS} border border-gray-100 rounded-2xl ${SUBTLE_SHADOW_CLASS} flex flex-col items-start h-full bg-white`}>
//         <div className={`p-3 rounded-full ${ACCENT_COLOR_CLASS} text-white mb-4`}>
//             <Icon size={24} />
//         </div>
//         <h3 className="text-xl font-bold mb-2">{title}</h3>
//         <p className="text-gray-500 text-base">{description}</p>
//     </div>
// );

// export default CustomCard;