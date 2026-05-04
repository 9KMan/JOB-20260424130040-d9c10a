import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'urgent':
      return 'text-red-400 bg-red-400/10';
    case 'high':
      return 'text-warning bg-warning/10';
    case 'medium':
      return 'text-primary bg-primary/10';
    case 'low':
      return 'text-success bg-success/10';
    default:
      return 'text-muted bg-muted/10';
  }
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    youtube: '▶',
    tiktok: '♪',
    instagram: '◻',
    twitter: '✉',
  };
  return icons[platform] || '◉';
}