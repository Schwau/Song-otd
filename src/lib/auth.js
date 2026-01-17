import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./db";

export const SESSION_COOKIE = "songotd_session";

export function newSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt <= new Date()) return null;

  return session.user;
}

export async function requireUser() {
  const user = await getUserFromRequest();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
