import { UserDataProvider } from "@/context/userE-mailContext";
import "../styles/globals.css";
import { ReactNode } from "react";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <title>Zmitac 2.0</title>
      </head>
      <body>
        <UserDataProvider>
          {children}
        </UserDataProvider>
      </body>
    </html>
  );
}