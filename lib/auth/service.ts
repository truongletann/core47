import { eq, or, sql } from "drizzle-orm";
import { getDb } from "@/db/client";
import { users, sessions } from "@/db/schema";
import {
  RegisterSchema,
  LoginSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  type RegisterInput,
  type LoginInput,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "./schema";
import { generateSalt, hashPassword, verifyPassword } from "./crypto";
import { SESSION_DURATION_DAYS } from "./config";
import type { User } from "@/types/auth";

function toUser(record: {
  id: string;
  email: string;
  username: string | null;
  isAdmin: number;
  isDisabled: number;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
}): User {
  return {
    id: record.id,
    email: record.email,
    username: record.username,
    name: record.name,
    avatarUrl: record.avatarUrl,
    isAdmin: Boolean(record.isAdmin),
    isDisabled: Boolean(record.isDisabled),
    createdAt: record.createdAt,
  };
}

export interface SessionDeviceInfo {
  platform?: "web" | "ios" | "android";
  deviceName?: string;
}

export async function registerUser(raw: RegisterInput): Promise<{ user: User; sessionId: string }> {
  const input = RegisterSchema.parse(raw);
  const db = await getDb();

  // Case-insensitive — "User@Example.com" and "user@example.com" (or
  // "Admin"/"admin") must be treated as the same account, both at
  // registration (to prevent a case-variant duplicate) and at login below.
  const existingEmail = await db
    .select()
    .from(users)
    .where(sql`lower(${users.email}) = lower(${input.email})`)
    .get();
  if (existingEmail) {
    throw new Error("EMAIL_TAKEN");
  }

  const username = input.username || null;
  if (username) {
    const existingUsername = await db
      .select()
      .from(users)
      .where(sql`lower(${users.username}) = lower(${username})`)
      .get();
    if (existingUsername) {
      throw new Error("USERNAME_TAKEN");
    }
  }

  // The first person to register automatically becomes admin
  const anyUser = await db.select().from(users).limit(1).get();
  const isFirstUser = !anyUser;

  const salt = generateSalt();
  const passwordHash = await hashPassword(input.password, salt);

  const userRecord = {
    id: crypto.randomUUID(),
    email: input.email,
    username,
    passwordHash,
    passwordSalt: salt,
    isAdmin: isFirstUser ? 1 : 0,
    isDisabled: 0,
    name: null,
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };
  await db.insert(users).values(userRecord);

  const sessionId = await createSession(userRecord.id);

  return { user: toUser(userRecord), sessionId };
}

export async function loginUser(
  raw: LoginInput,
  device?: SessionDeviceInfo,
): Promise<{ user: User; sessionId: string }> {
  const input = LoginSchema.parse(raw);
  const db = await getDb();

  const record = await db
    .select()
    .from(users)
    .where(
      or(
        sql`lower(${users.email}) = lower(${input.identifier})`,
        sql`lower(${users.username}) = lower(${input.identifier})`,
      ),
    )
    .get();

  if (!record) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await verifyPassword(input.password, record.passwordSalt, record.passwordHash);
  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (record.isDisabled) {
    throw new Error("ACCOUNT_DISABLED");
  }

  const now = new Date().toISOString();
  await db.update(users).set({ lastLoginAt: now }).where(eq(users.id, record.id));
  record.lastLoginAt = now;

  const sessionId = await createSession(record.id, device);

  return { user: toUser(record), sessionId };
}

async function createSession(userId: string, device?: SessionDeviceInfo): Promise<string> {
  const db = await getDb();
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
    createdAt: new Date().toISOString(),
    platform: device?.platform ?? null,
    deviceName: device?.deviceName ?? null,
  });

  return sessionId;
}

export async function getUserBySessionId(sessionId: string | undefined): Promise<User | null> {
  if (!sessionId) return null;
  const db = await getDb();

  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).get();
  if (!session) return null;

  if (new Date(session.expiresAt) < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  const record = await db.select().from(users).where(eq(users.id, session.userId)).get();
  if (!record) return null;

  if (record.isDisabled) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return null;
  }

  return toUser(record);
}

export async function updateProfile(userId: string, raw: UpdateProfileInput): Promise<User> {
  const input = UpdateProfileSchema.parse(raw);
  const db = await getDb();

  const newUsername = input.username || null;
  if (newUsername) {
    const existing = await db
      .select()
      .from(users)
      .where(sql`lower(${users.username}) = lower(${newUsername})`)
      .get();
    if (existing && existing.id !== userId) {
      throw new Error("USERNAME_TAKEN");
    }
  }

  await db
    .update(users)
    .set({
      name: input.name || null,
      username: newUsername,
    })
    .where(eq(users.id, userId));

  const record = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!record) throw new Error("USER_NOT_FOUND");

  return toUser(record);
}

export async function changePassword(
  userId: string,
  raw: ChangePasswordInput,
  currentSessionId?: string,
): Promise<void> {
  const input = ChangePasswordSchema.parse(raw);
  const db = await getDb();

  const record = await db.select().from(users).where(eq(users.id, userId)).get();
  if (!record) throw new Error("USER_NOT_FOUND");

  const valid = await verifyPassword(input.currentPassword, record.passwordSalt, record.passwordHash);
  if (!valid) throw new Error("WRONG_CURRENT_PASSWORD");

  const newSalt = generateSalt();
  const newHash = await hashPassword(input.newPassword, newSalt);

  await db
    .update(users)
    .set({ passwordHash: newHash, passwordSalt: newSalt })
    .where(eq(users.id, userId));

  // Invalidate any other active sessions in case the password was changed
  // because a session/credential was compromised.
  await deleteOtherSessions(userId, currentSessionId);
}

export async function deleteSession(sessionId: string): Promise<void> {
  const db = await getDb();
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function deleteAllSessionsForUser(userId: string): Promise<void> {
  const db = await getDb();
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function deleteOtherSessions(userId: string, keepSessionId?: string): Promise<void> {
  const db = await getDb();
  const all = await db.select({ id: sessions.id }).from(sessions).where(eq(sessions.userId, userId)).all();
  const toDelete = all.map((s) => s.id).filter((id) => id !== keepSessionId);
  if (toDelete.length === 0) return;
  for (const id of toDelete) {
    await db.delete(sessions).where(eq(sessions.id, id));
  }
}
