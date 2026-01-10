// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Restaurant",
  description: "Welcome to Restaurant Ordering App...",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Text:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
          {children}
          <Toaster position="top-right" richColors   duration={4000}  
          toastOptions={{
            className: "toast-with-progress",
          }}
          />
        
      </body>
    </html>
  );
}