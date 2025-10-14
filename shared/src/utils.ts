import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ContextCard = {
  id: string;
  content: string;
  source: string;
  createdAt: Date;
  metadata?: {
    title?: string;
    url?: string;
    selectedText?: string;
  };
};
