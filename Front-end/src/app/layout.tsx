import type { Metadata } from "next";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeSettingsPanel } from "@/components/ThemeSettingsPanel";
import { Toaster } from "sonner";
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
    <html lang="en" className="h-full antialiased">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-main-bg text-white">
        <ThemeProvider>
          <AppContextProvider>
            {children}
            <ThemeSettingsPanel />
            <Toaster richColors position="bottom-right" theme="system" />
          </AppContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
