import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

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
      const updated = await prisma.category.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, category: updated });
    } catch (dbErr) {
      // Fallback in memory
      const index = MOCK_CATEGORIES.findIndex((c) => c.id === id);
      if (index !== -1) {
        MOCK_CATEGORIES[index].status = status;
        return NextResponse.json({
          success: true,
          category: MOCK_CATEGORIES[index],
        });
      }
      return NextResponse.json({ error: "Categoría no encontrada." }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error al actualizar estado de categoría:", error);
    return NextResponse.json({ error: "Error en el servidor." }, { status: 500 });
  }
}
