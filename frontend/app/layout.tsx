import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sahitna Safe | AI-Powered Breast Cancer Risk Assessment",
  description: "Sahitna Safe: Advanced machine learning system for breast cancer diagnosis and risk stratification. Clinical-grade predictions powered by validated ML models for early detection support.",
  keywords: ["sahitna safe", "breast cancer", "machine learning", "medical AI", "risk stratification", "clinical decision support"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <Navbar />
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e2e8f0',
            },
          }}
        />
      </body>
    </html>
  );
}


