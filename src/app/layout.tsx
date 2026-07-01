import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Претседател на Советот на Општина Кочани",
  description:
    "Официјална веб-страница за комуникација со Претседателот на Советот на Општина Кочани.",
  metadataBase: new URL("http://localhost:3000")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mk">
      <body>{children}</body>
    </html>
  );
}
