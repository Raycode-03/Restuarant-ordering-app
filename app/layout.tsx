// app/layout.tsx
import type { Metadata } from "next";
import { DM_Serif_Text } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const dmSerifText = DM_Serif_Text({
  weight: ["400"], // Regular weight
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap", // Better performance
});

export const metadata: Metadata = {
  title: "Restaurant",
  description: "Welcome to Restaurant Ordering App...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSerifText.variable}>
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          duration={4000}  
          toastOptions={{
            className: "toast-with-progress",
          }}
        />
      </body>
    </html>
  );
}