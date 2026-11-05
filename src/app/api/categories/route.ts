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
  } catch (error) {
    console.error("Error al obtener categorías de la BD:", error);
  }

  return NextResponse.json({ categories: MOCK_CATEGORIES });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, requestedById } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "El nombre de la categoría es obligatorio." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const slug = slugify(cleanName);

    // Verificar si la categoría ya existe
    try {
      const existing = await prisma.category.findFirst({
        where: {
          slug: { equals: slug, mode: "insensitive" },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Ya existe una categoría con ese nombre." },
          { status: 400 }
        );
      }
    } catch {
      // Si la BD no responde, continúa la ejecución hacia el mock
    }

    try {
      const newCategory = await prisma.category.create({
        data: {
          name: cleanName,
          slug,
          description: description?.trim() || null,
          status: "PENDING",
          requestedById: requestedById || null,
        },
        include: {
          requestedBy: {
            select: {
              name: true,
              email: true,
              vendor: {
                select: {
                  storeName: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          category: newCategory,
          message:
            "Categoría solicitada con éxito. Pendiente de aprobación por el Super Administrador.",
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.warn(
        "Base de datos no disponible, guardando categoría en memoria local:",
        dbError?.message || dbError
      );

      const simulatedCategory: any = {
        id: `cat_${Date.now()}`,
        name: cleanName,
        slug,
        description: description?.trim() || null,
        status: "PENDING",
        requestedById: requestedById || "usr_vendor_1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MOCK_CATEGORIES.unshift(simulatedCategory);

      return NextResponse.json(
        {
          success: true,
          category: simulatedCategory,
          message:
            "Categoría solicitada con éxito. Pendiente de aprobación por el Super Administrador.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error al solicitar categoría:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud de la categoría." },
      { status: 500 }
    );
  }
}
