import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/lib/session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  email: string;
  exp: number;
};

function getAdminEmail() {
  return process.env.ADMIN_EMAIL?.trim();
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

function getSessionSecret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
}

function encodePayload(payload: SessionPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decodePayload(payload: string): SessionPayload | null {
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

function sign(payload: string) {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("Недостасува SESSION_SECRET или ADMIN_PASSWORD.");
  }

  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function verifySignature(payload: string, signature: string) {
  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

export function adminEnvironmentIsConfigured() {
  return Boolean(getAdminEmail() && getAdminPassword() && getSessionSecret());
}

export function adminCredentialsAreValid(email: string, password: string) {
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();

  return Boolean(adminEmail && adminPassword && email === adminEmail && password === adminPassword);
}

export function createSessionToken(email: string) {
  const payload = encodePayload({
    email,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  });

  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string) {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || !verifySignature(payload, signature)) {
    return null;
  }

  const decodedPayload = decodePayload(payload);
  const adminEmail = getAdminEmail();

  if (!decodedPayload || !adminEmail) {
    return null;
  }

  if (decodedPayload.email !== adminEmail || decodedPayload.exp < Date.now()) {
    return null;
  }

  return {
    email: decodedPayload.email
  };
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/"
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
