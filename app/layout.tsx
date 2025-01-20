import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/nav-bar";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Suppress outdated Next.js warning
export const unstable_noStore = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
