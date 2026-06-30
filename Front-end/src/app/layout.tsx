import type { Metadata } from "next";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeSettingsPanel } from "@/components/ThemeSettingsPanel";
import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/context/LanguageContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Valens | Premium Performance Supplements",
  description: "Formulated in science, unleashed in performance. High-end fitness and health supplements with clinical dosages and complete label transparency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-main-bg text-white">
       <LanguageProvider>
        <ThemeProvider>
          <AppContextProvider>
            {children}
            <ThemeSettingsPanel />
            <Toaster richColors position="bottom-right" theme="system" />
          </AppContextProvider>
        </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
