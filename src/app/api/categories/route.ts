import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbCategories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbCategories.length > 0) {
      return NextResponse.json({ categories: dbCategories });
    }
  } catch (error) {}

  return NextResponse.json({ categories: MOCK_CATEGORIES });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "El nombre de la categoría es obligatorio." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const slug = slugify(cleanName) + "-" + Date.now().toString().slice(-4);

    try {
      // Find default vendor user to link requestedById
      const user = await prisma.user.findFirst({
        where: { role: "VENDOR" },
      });

      const newCategory = await prisma.category.create({
        data: {
          name: cleanName,
          slug,
          description: description?.trim() || null,
          status: "PENDING", // Pending approval by Super Admin
          requestedById: user ? user.id : undefined,
        },
      });

      return NextResponse.json(
        {
          success: true,
          category: newCategory,
          message: "Categoría solicitada con éxito. Pendiente de aprobación por el Super Administrador.",
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.warn("Base de datos no disponible, guardando categoría en memoria local:", dbError.message);

      const simulatedCategory = {
        id: `cat_${Date.now()}`,
        name: cleanName,
        slug,
        description: description?.trim() || null,
        status: "PENDING" as const,
        requestedById: "usr_vendor_1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      MOCK_CATEGORIES.unshift(simulatedCategory);

      return NextResponse.json(
        {
          success: true,
          category: simulatedCategory,
          message: "Categoría solicitada con éxito. Pendiente de aprobación por el Super Administrador.",
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error al solicitar categoría:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud de la categoría." },
      { status: 500 }
    );
  }
}
