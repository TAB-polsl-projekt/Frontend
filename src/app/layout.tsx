import "../styles/globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <title>Zmitac 2.0</title>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}