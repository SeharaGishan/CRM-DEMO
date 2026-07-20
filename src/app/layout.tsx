import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AppDataProvider } from "@/context/AppDataContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Sharkonix CRM — Demo",
  description: "Frontend demo CRM built by Sharkonix Technologies (Pvt) Ltd",
};

const noFlashScript = `
try {
  var t = localStorage.getItem('crm-theme');
  document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
} catch (e) {}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <Script id="no-flash-theme" strategy="beforeInteractive">{noFlashScript}</Script>
      </head>
      <body className="min-h-full bg-[var(--color-background)] text-[var(--color-foreground)]">
        <div className="mesh-background" aria-hidden />
        <ThemeProvider>
          <ToastProvider>
            <AppDataProvider>{children}</AppDataProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
