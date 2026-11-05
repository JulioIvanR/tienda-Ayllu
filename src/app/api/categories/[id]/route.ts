import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const { id, name, description } = await req.json();

    if (!id || !name?.trim()) {
      return NextResponse.json(
        { error: "Se requieren ID y nombre de la categoría." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const slug = slugify(cleanName);

    try {
      // Verificar si el nuevo nombre ya existe (excluyendo la categoría actual)
      const existing = await prisma.category.findFirst({
        where: {
          slug: { equals: slug, mode: "insensitive" },
          NOT: { id }
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Ya existe otra categoría con ese nombre." },
          { status: 400 }
        );
      }

      const updated = await prisma.category.update({
        where: { id },
        data: {
          name: cleanName,
          slug,
          description: description?.trim() || null,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({ success: true, category: updated });
    } catch (dbErr) {
      // Fallback a MOCK_CATEGORIES
      const index = MOCK_CATEGORIES.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_CATEGORIES[index] = {
          ...MOCK_CATEGORIES[index],
          name: cleanName,
          slug,
          description: description?.trim() || null,
          updatedAt: new Date()
        };
        return NextResponse.json({
          success: true,
          category: MOCK_CATEGORIES[index]
        });
      }
      return NextResponse.json(
        { error: "Categoría no encontrada." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    return NextResponse.json(
      { error: "Error en el servidor." },
      { status: 500 }
    );
  }
}

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
