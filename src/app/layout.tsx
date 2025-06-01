import "../styles/globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/utils/theme-provider"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <title>Zmitac 2.0</title>
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}