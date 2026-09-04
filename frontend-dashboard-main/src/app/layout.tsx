import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nextract — Product data, made useful",
  description:
    "Turn messy product feeds into clean, usable catalogs without writing code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
