import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SmartInvest — Premium AI Investment Research Agent',
  description:
    'A multi-agent investment analysis dashboard powered by LangGraph.js, Groq Llama 3.3 70B, Yahoo Finance, and Tavily Search. Get automated INVEST or PASS recommendations with explainable AI scores.',
  keywords: ['investment research', 'AI investing', 'financial analysis', 'multi-agent workflows', 'LangGraph', 'Llama 3.3'],
  authors: [{ name: 'SmartInvest Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-gray-100">
        {children}
      </body>
    </html>
  );
}
