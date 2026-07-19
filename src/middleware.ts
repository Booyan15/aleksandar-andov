import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";

const MIN_SESSION_SECRET_LENGTH = 32;

type SessionPayload = {
  email: string;
  exp: number;
};

function base64UrlToString(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(payload: string) {
  const secret = process.env.SESSION_SECRET?.trim();

  if (!secret || secret.length < MIN_SESSION_SECRET_LENGTH) {
    return null;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

function constantTimeEqual(a: string, b: string) {
  const maxLength = Math.max(a.length, b.length);
  let result = a.length ^ b.length;

  for (let index = 0; index < maxLength; index += 1) {
    result |= (a.charCodeAt(index) || 0) ^ (b.charCodeAt(index) || 0);
  }

  return result === 0;
}

async function sessionIsValid(token?: string) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = await sign(payload);

  if (!expectedSignature || !constantTimeEqual(expectedSignature, signature)) {
    return false;
  }

  try {
    const decodedPayload = JSON.parse(base64UrlToString(payload)) as SessionPayload;
    return decodedPayload.email === process.env.ADMIN_EMAIL?.trim().toLowerCase() && decodedPayload.exp > Date.now();
  } catch {
    return false;
  }
}

function configuredCanonicalOrigin() {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ??
    process.env.VERCEL_URL?.trim();

  if (!configuredSiteUrl) {
    return null;
  }

  try {
    return new URL(/^https?:\/\//i.test(configuredSiteUrl) ? configuredSiteUrl : `https://${configuredSiteUrl}`).origin;
  } catch {
    return null;
  }
}

function redirectToOrigin(request: NextRequest, origin: string) {
  const url = request.nextUrl.clone();
  const target = new URL(url.pathname + url.search, origin);
  return NextResponse.redirect(target, 308);
}

function productionRedirect(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

  if (forwardedProtocol === "http") {
    return redirectToOrigin(request, `https://${request.nextUrl.host}`);
  }

  const canonicalOrigin = configuredCanonicalOrigin();

  if (canonicalOrigin && request.nextUrl.origin !== canonicalOrigin) {
    return redirectToOrigin(request, canonicalOrigin);
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const redirectResponse = productionRedirect(request);

  if (redirectResponse) {
    return redirectResponse;
  }

  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isValid = await sessionIsValid(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (!isValid) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"]
};
