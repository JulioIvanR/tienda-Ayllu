import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "tu-secreto-super-seguro-cambiar-en-produccion";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    // Validar que los campos requeridos estén presentes
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Correo/usuario y contraseña son requeridos." },
        { status: 400 }
      );
    }

    // Buscar el usuario por email o nombre de usuario
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { name: identifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Correo/usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    // Verificar que el usuario tenga contraseña (no sea OAuth)
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Este usuario no tiene contraseña configurada." },
        { status: 401 }
      );
    }

    // Comparar contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Correo/usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    // Verificar que el usuario esté aprobado
    if (user.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Tu cuenta aún no ha sido aprobada. Por favor, espera la confirmación del administrador." },
        { status: 403 }
      );
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Crear respuesta con cookie httpOnly
    const response = NextResponse.json(
      {
        message: "Inicio de sesión exitoso.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Configurar cookie httpOnly segura
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 días en segundos
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
