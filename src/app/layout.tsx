import type { Metadata } from "next";
import "./globals.css";

const title = "Претседател на Советот на Општина Кочани";
const description =
  "Официјална веб-платформа за комуникација со претседателот на Советот на Општина Кочани. Поставете прашање, доставете предлог или пријавете проблем од јавен интерес.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kocani.gov.mk";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Совет на Општина Кочани"
  },
  description,
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
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "mk_MK",
    siteName: "Совет на Општина Кочани",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml"
      }
    ],
    shortcut: "/favicon.svg",
    apple: "/municipality-coat-placeholder.png"
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
