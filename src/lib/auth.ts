import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ApprovalStatus, Role, Vendor } from "@/types";

export const AUTH_COOKIE_NAME = "auth_token";

const JWT_SECRET =
  process.env.JWT_SECRET || "tu-secreto-super-seguro-cambiar-en-produccion";

export interface JwtUserPayload {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
}

export interface SessionUserWithVendor {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  status: ApprovalStatus;
  vendor: Vendor | null;
}

export function serializeVendor<
  T extends {
    createdAt: Date | string;
    updatedAt: Date | string;
  }
>(vendor: T): Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
} {
  return {
    ...vendor,
    createdAt:
      vendor.createdAt instanceof Date
        ? vendor.createdAt.toISOString()
        : String(vendor.createdAt),
    updatedAt:
      vendor.updatedAt instanceof Date
        ? vendor.updatedAt.toISOString()
        : String(vendor.updatedAt),
  };
}

export function verifyAuthToken(token: string): JwtUserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof (decoded as JwtUserPayload).id !== "string"
    ) {
      return null;
    }
    return decoded as JwtUserPayload;
  } catch {
    return null;
  }
}

export async function getAuthToken(req?: NextRequest): Promise<string | null> {
  if (req) {
    return req.cookies.get(AUTH_COOKIE_NAME)?.value ?? null;
  }

  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

async function ensureVendorForUser(user: {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}): Promise<Vendor | null> {
  if (user.role !== "VENDOR") {
    return null;
  }

  const existing = await prisma.vendor.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    return serializeVendor(existing);
  }

  const baseName =
    user.name?.trim() || user.email.split("@")[0] || "Mi Tienda";
  let uniqueSlug = slugify(baseName).replace(/^-+|-+$/g, "") || `tienda-${Date.now()}`;

  const existingSlug = await prisma.vendor.findUnique({
    where: { slug: uniqueSlug },
    select: { id: true },
  });

  if (existingSlug) {
    uniqueSlug = `${uniqueSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  const created = await prisma.vendor.create({
    data: {
      userId: user.id,
      storeName: baseName,
      slug: uniqueSlug,
      whatsappNumber: "",
      email: user.email,
    },
  });

  return serializeVendor(created);
}

export async function getCurrentSessionUser(
  req?: NextRequest
): Promise<SessionUserWithVendor | null> {
  const token = await getAuthToken(req);
  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      vendor: true,
    },
  });

  if (!user) {
    return null;
  }

  let vendor: Vendor | null = user.vendor ? serializeVendor(user.vendor) : null;

  if (user.role === "VENDOR" && !vendor) {
    vendor = await ensureVendorForUser({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    vendor,
  };
}
