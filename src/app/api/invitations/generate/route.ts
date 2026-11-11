import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "tu-secreto-super-seguro-cambiar-en-produccion"
);

export async function POST(req: NextRequest) {
  try {
    // Verificar que el usuario sea Super Admin
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No autorizado. Token no encontrado." },
        { status: 401 }
      );
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const user = verified.payload as any;

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Solo el Super Admin puede generar invitaciones." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, role = "VENDOR", expirationDays = 7 } = body;

    // Generar token único
    const invitationToken = uuidv4();

    // Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    // Crear invitación en la base de datos
    const invitation = await prisma.invitation.create({
      data: {
        email: email || null,
        token: invitationToken,
        role,
        expiresAt,
      },
    });

    // Generar URL de registro
    const registroUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/registro?token=${invitationToken}`;

    return NextResponse.json(
      {
        message: "Invitación generada exitosamente.",
        invitation: {
          id: invitation.id,
          email: invitation.email,
          token: invitation.token,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
          registroUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generando invitación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
