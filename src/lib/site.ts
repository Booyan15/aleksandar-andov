const LOCAL_DEVELOPMENT_SITE_URL = "http://localhost:3000";

function withProtocol(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function normalizeSiteUrl(value: string | undefined) {
  const trimmed = value?.trim().replace(/\/+$/, "");

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(withProtocol(trimmed));
    url.hash = "";
    url.search = "";
    url.pathname = url.pathname.replace(/\/+$/, "");

    return url;
  } catch {
    return null;
  }
}

export const siteUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeSiteUrl(process.env.VERCEL_URL) ??
  new URL(LOCAL_DEVELOPMENT_SITE_URL);

export const siteOrigin = siteUrl.toString().replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteOrigin}/`).toString();
}

export const siteConfig = {
  name: "Александар Андов",
  title: "Александар Андов | Претседател на Советот на Општина Кочани",
  titleTemplate: "%s | Александар Андов",
  description:
    "Официјална веб-страница на Александар Андов, претседател на Советот на Општина Кочани. Поставете прашање, пријавете проблем и информирајте се за работата на Советот.",
  applicationName: "Александар Андов",
  author: "Александар Андов",
  creator: "Александар Андов",
  publisher: "Општина Кочани",
  locale: "mk_MK",
  language: "mk",
  keywords: [
    "Александар Андов",
    "Претседател на Советот",
    "Совет на Општина Кочани",
    "Општина Кочани",
    "Кочани",
    "постави прашање",
    "пријави проблем",
    "граѓанска комуникација",
    "локална самоуправа"
  ],
  socialImage: {
    path: "/social-preview.png",
    width: 1200,
    height: 630,
    alt: "Александар Андов, Претседател на Советот на Општина Кочани"
  }
} as const;
