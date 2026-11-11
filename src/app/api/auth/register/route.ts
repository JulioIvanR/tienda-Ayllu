import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "tu-secreto-super-seguro-cambiar-en-produccion";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, token, role = "VENDOR" } = body;

    // Validar campos requeridos
    if (!name || !email || !password || !token) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos." },
        { status: 400 }
      );
    }

    // Validar que el token sea válido
    const invitation = await prisma.invitation.findUnique({
      where: { token },
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

    // Verificar que el email no exista
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este correo ya está registrado." },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: role as "VENDOR" | "SUPER_ADMIN",
        status: "APPROVED",
      },
    });

    // Si el rol es VENDOR, crear perfil de vendedor
    if (role === "VENDOR") {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          storeName: name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          email,
        },
      });
    }

    // Marcar invitación como usada
    await prisma.invitation.update({
      where: { token },
      data: { used: true },
    });

    // Generar JWT
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

    // Crear respuesta con cookie
    const response = NextResponse.json(
      {
        message: "Cuenta creada exitosamente.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("auth_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
