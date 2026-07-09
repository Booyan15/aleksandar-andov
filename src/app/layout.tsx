import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Претседател на Советот на Општина Кочани",
    template: "%s | Совет на Општина Кочани"
  },
  description:
    "Официјална веб-платформа за комуникација со претседателот на Советот на Општина Кочани. Поставете прашање, доставете предлог или пријавете проблем од јавен интерес.",
  keywords: [
    "Претседател на Советот на Општина Кочани",
    "Совет на Општина Кочани",
    "Општина Кочани",
    "Кочани",
    "постави прашање",
    "пријави проблем",
    "граѓани",
    "локална самоуправа"
  ],
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml"
      }
    ],
    shortcut: "/favicon.svg",
    apple: "/municipality-coat-placeholder.png"
  },
  openGraph: {
    title: "Претседател на Советот на Општина Кочани",
    description:
      "Официјална веб-платформа за комуникација со претседателот на Советот на Општина Кочани.",
    type: "website",
    locale: "mk_MK",
    siteName: "Совет на Општина Кочани"
  },
  twitter: {
    card: "summary_large_image",
    title: "Претседател на Советот на Општина Кочани",
    description:
      "Поставете прашање, доставете предлог или пријавете проблем од јавен интерес."
  },
  robots: {
    index: true,
    follow: true
  }
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
