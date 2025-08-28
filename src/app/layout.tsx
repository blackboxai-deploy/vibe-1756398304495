import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Image Generator",
  description: "Generate stunning images with AI using advanced models",
  keywords: ["AI", "image generation", "FLUX", "artificial intelligence", "creative tools"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
          {children}
        </div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}