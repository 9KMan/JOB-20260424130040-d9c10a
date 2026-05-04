import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Factory - AI-Powered Content Creation',
  description: 'Transform your content creation with AI-powered insights, trend analysis, and automated scheduling.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text min-h-screen">
        {children}
      </body>
    </html>
  );
}