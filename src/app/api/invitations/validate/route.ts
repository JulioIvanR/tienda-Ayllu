import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token no proporcionado." },
        { status: 400 }
      );
    }

    // Buscar la invitación
    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitación no encontrada." },
        { status: 404 }
      );
    }

    // Verificar si ya fue usada
    if (invitation.used) {
      return NextResponse.json(
        { error: "Esta invitación ya ha sido utilizada." },
        { status: 410 }
      );
    }

    // Verificar si expiró
    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: "Esta invitación ha expirado." },
        { status: 410 }
      );
    }

    return NextResponse.json(
      {
        message: "Invitación válida.",
        invitation: {
          token: invitation.token,
          email: invitation.email,
          role: invitation.role,
          expiresAt: invitation.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validando invitación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
