import { headers } from "next/headers";
import { HONEYPOT_FIELD_NAME } from "@/lib/form-security";
import { checkRateLimit, type RateLimitResult } from "@/lib/rate-limit";
import { siteOrigin } from "@/lib/site";

type RateLimitConfig = {
  namespace: string;
  limit: number;
  windowMs: number;
  discriminator?: string;
};

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim();
}

function requestOriginFromHeaders(headerList: Headers) {
  const host = firstHeaderValue(headerList.get("x-forwarded-host")) ?? headerList.get("host");

  if (!host) {
    return null;
  }

  const protocol = firstHeaderValue(headerList.get("x-forwarded-proto")) ?? "https";
  return `${protocol}://${host}`;
}

function normalizeOrigin(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function clientIpFromHeaders(headerList: Headers) {
  return (
    firstHeaderValue(headerList.get("x-forwarded-for")) ??
    firstHeaderValue(headerList.get("x-real-ip")) ??
    firstHeaderValue(headerList.get("cf-connecting-ip")) ??
    "unknown"
  );
}

export async function assertTrustedRequestOrigin() {
  const headerList = await headers();
  const origin = normalizeOrigin(headerList.get("origin"));

  if (!origin) {
    return;
  }

  const allowedOrigins = new Set(
    [
      normalizeOrigin(siteOrigin),
      ...(process.env.NODE_ENV !== "production" ? [normalizeOrigin(requestOriginFromHeaders(headerList))] : [])
    ].filter((value): value is string => Boolean(value))
  );

  if (!allowedOrigins.has(origin)) {
    throw new Error("UNTRUSTED_REQUEST_ORIGIN");
  }
}

export async function rateLimitCurrentRequest({
  namespace,
  limit,
  windowMs,
  discriminator
}: RateLimitConfig): Promise<RateLimitResult> {
  const headerList = await headers();
  const ip = clientIpFromHeaders(headerList);
  const safeDiscriminator = discriminator?.trim().toLowerCase() || "default";

  return checkRateLimit({
    key: `${namespace}:${ip}:${safeDiscriminator}`,
    limit,
    windowMs
  });
}

export function honeypotFieldWasFilled(formData: FormData) {
  const value = formData.get(HONEYPOT_FIELD_NAME);
  return typeof value === "string" && value.trim().length > 0;
}
