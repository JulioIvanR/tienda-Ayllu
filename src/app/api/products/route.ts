import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSessionUser } from "@/lib/auth";
import { DEFAULT_PRODUCTS_PAGE_SIZE, getProductsPage } from "@/lib/catalog";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10) || 1;
    const limit =
      parseInt(
        searchParams.get("limit") || String(DEFAULT_PRODUCTS_PAGE_SIZE),
        10
      ) || DEFAULT_PRODUCTS_PAGE_SIZE;
    const categoryId = searchParams.get("categoryId") || undefined;

    const result = await getProductsPage({ page, limit, categoryId });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al cargar los productos." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSessionUser(req);

    if (!session) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para publicar productos." },
        { status: 401 }
      );
    }

    if (session.role !== "VENDOR" || !session.vendor) {
      return NextResponse.json(
        { error: "Solo los vendedores con tienda asignada pueden publicar productos." },
        { status: 403 }
      );
    }

    if (session.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Tu cuenta aún no ha sido aprobada para publicar productos." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, slug, price, stock, categoryId, images, description } = body;

    const cleanTitle = typeof title === "string" ? title.trim() : "";
    let cleanSlug =
      slugify(typeof slug === "string" && slug.trim() ? slug : cleanTitle).replace(
        /^-+|-+$/g,
        ""
      );

    if (!cleanTitle || !cleanSlug || price === undefined || Number.isNaN(Number(price))) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios del producto (título, slug, precio)." },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.product.findUnique({
      where: { slug: cleanSlug },
      select: { id: true },
    });

    if (existingSlug) {
      cleanSlug = `${cleanSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    let category = categoryId
      ? await prisma.category.findUnique({ where: { id: categoryId } })
      : null;

    if (!category) {
      category = await prisma.category.findFirst();
    }

    if (!category) {
      return NextResponse.json(
        { error: "No hay una categoría válida seleccionada." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        price: parseFloat(String(price)),
        stock: parseInt(String(stock), 10) || 0,
        images: Array.isArray(images) ? images : [],
        description: typeof description === "string" ? description.trim() : "",
        categoryId: category.id,
        vendorId: session.vendor.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        product: {
          ...product,
          price: Number(product.price),
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "Error al procesar la creación del producto." },
      { status: 500 }
    );
  }
}
