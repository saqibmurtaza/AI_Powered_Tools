// frontend/src/app/tools/tenure-calculator/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work Tenure Calculator | Calculate Years of Service & Experience',
  description: 'Free online tool to calculate exact work tenure, years of service, and professional experience.',
};

export default function TenureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}