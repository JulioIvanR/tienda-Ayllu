import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_USERS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Estado no válido." }, { status: 400 });
    }

    try {
      const existing = await prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true },
      });

      if (!existing) {
        const mockIndex = MOCK_USERS.findIndex((u) => u.id === id);
        if (mockIndex !== -1) {
          if (MOCK_USERS[mockIndex].role === "SUPER_ADMIN") {
            return NextResponse.json(
              { error: "No se puede modificar el estado de un Super Admin." },
              { status: 403 }
            );
          }
          MOCK_USERS[mockIndex].status = status;
          return NextResponse.json({
            success: true,
            user: MOCK_USERS[mockIndex],
          });
        }

        return NextResponse.json(
          { error: "Usuario no encontrado." },
          { status: 404 }
        );
      }

      if (existing.role === "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "No se puede modificar el estado de un Super Admin." },
          { status: 403 }
        );
      }

      const updated = await prisma.user.update({
        where: { id },
        data: { status },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({ success: true, user: updated });
    } catch (dbErr) {
      console.warn("Error de BD al actualizar usuario; intentando respaldo mock:", dbErr);

      const mockIndex = MOCK_USERS.findIndex((u) => u.id === id);
      if (mockIndex !== -1) {
        if (MOCK_USERS[mockIndex].role === "SUPER_ADMIN") {
          return NextResponse.json(
            { error: "No se puede modificar el estado de un Super Admin." },
            { status: 403 }
          );
        }
        MOCK_USERS[mockIndex].status = status;
        return NextResponse.json({
          success: true,
          user: MOCK_USERS[mockIndex],
        });
      }

      return NextResponse.json(
        { error: "No se pudo actualizar el usuario en la base de datos." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error al actualizar estado de usuario:", error);
    return NextResponse.json(
      { error: "Error en el servidor." },
      { status: 500 }
    );
  }
}
