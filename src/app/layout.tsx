import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase-store";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unhinged — OC Dating Platform",
  description: "Create dating profiles for your Original Characters and find the perfect match.",
  icons: {
    icon: [
      { url: "/icon.avif", type: "image/avif" },
    ],
    apple: { url: "/icon.avif", type: "image/avif" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "#12121a",
                border: "1px solid #1e1e2e",
                color: "#fafafa",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
