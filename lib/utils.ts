import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const generateCarImageUrl = (brand: string, model: string): string => {
  const fallbackImage = 'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg';
  
  try {
    // This is a simplistic approach - in production, you'd want a more robust solution
    return fallbackImage;
  } catch (error) {
    console.error('Error generating car image URL:', error);
    return fallbackImage;
  }
};