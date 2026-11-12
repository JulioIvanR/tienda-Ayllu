import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const JWT_SECRET =
  process.env.JWT_SECRET || "tu-secreto-super-seguro-cambiar-en-produccion";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, storeName, email, password, token, whatsappNumber } = body;

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanStoreName =
      typeof storeName === "string" ? storeName.trim() : "";
    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";
    const cleanPassword = typeof password === "string" ? password : "";
    const cleanToken = typeof token === "string" ? token.trim() : "";
    const cleanWhatsapp =
      typeof whatsappNumber === "string" ? whatsappNumber.trim() : "";

    // Validar campos requeridos (token es opcional para el registro directo de tiendas)
    if (
      !cleanName ||
      !cleanEmail ||
      !cleanPassword ||
      (!cleanToken && !cleanStoreName)
    ) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Por favor, ingresa un correo electrónico válido." },
        { status: 400 }
      );
    }

    if (cleanPassword.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres." },
        { status: 400 }
      );
    }

    let assignedRole: "VENDOR" | "SUPER_ADMIN" = "VENDOR";
    let assignedStatus: "PENDING" | "APPROVED" = "PENDING";

    // Si se proporciona un token de invitación, validarlo
    if (cleanToken) {
      const invitation = await prisma.invitation.findUnique({
        where: { token: cleanToken },
      });

      if (!invitation) {
        return NextResponse.json(
          { error: "Invitación no encontrada." },
          { status: 404 }
        );
      }

      if (invitation.used) {
        return NextResponse.json(
          { error: "Esta invitación ya ha sido utilizada." },
          { status: 410 }
        );
      }

      if (new Date() > invitation.expiresAt) {
        return NextResponse.json(
          { error: "Esta invitación ha expirado." },
          { status: 410 }
        );
      }

      assignedRole = invitation.role;
      assignedStatus = "APPROVED";
    }

    // Verificar que el email no exista
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este correo ya está registrado." },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(cleanPassword, 10);

    // Preparar slug único para la tienda
    const effectiveStoreName = cleanStoreName || cleanName;
    let uniqueSlug = slugify(effectiveStoreName) || `tienda-${Date.now()}`;

    if (assignedRole === "VENDOR") {
      const existingVendorSlug = await prisma.vendor.findUnique({
        where: { slug: uniqueSlug },
        select: { id: true },
      });

      if (existingVendorSlug) {
        uniqueSlug = `${uniqueSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    // Crear usuario, perfil de vendedor y marcar invitación en una transacción
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: cleanEmail,
          name: cleanName,
          passwordHash,
          role: assignedRole,
          status: assignedStatus,
        },
      });

      if (assignedRole === "VENDOR") {
        await tx.vendor.create({
          data: {
            userId: createdUser.id,
            storeName: effectiveStoreName,
            slug: uniqueSlug,
            whatsappNumber: cleanWhatsapp,
            email: cleanEmail,
          },
        });
      }

      if (cleanToken) {
        await tx.invitation.update({
          where: { token: cleanToken },
          data: { used: true },
        });
      }

      return createdUser;
    });

    const response = NextResponse.json(
      {
        message:
          assignedStatus === "APPROVED"
            ? "Cuenta creada exitosamente."
            : "Registro completado. Tu tienda está pendiente de aprobación por el administrador.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
        },
      },
      { status: 201 }
    );

    // Iniciar sesión automáticamente solo si ya está aprobado (p. ej. con invitación)
    if (assignedStatus === "APPROVED") {
      const jwtToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      response.cookies.set("auth_token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
