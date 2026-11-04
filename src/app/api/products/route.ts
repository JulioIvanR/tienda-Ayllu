import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, price, stock, categoryId, images, description } = body;

    if (!title || !slug || price === undefined) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios del producto (título, slug, precio)." },
        { status: 400 }
      );
    }

    try {
      // Find default vendor or first approved vendor in database
      let vendor = await prisma.vendor.findFirst();
      if (!vendor) {
        // Find or create default user and vendor
        const user = await prisma.user.upsert({
          where: { email: "cafe@delvalle.com" },
          update: {},
          create: {
            email: "cafe@delvalle.com",
            name: "Carlos Restrepo",
            role: "VENDOR",
            status: "APPROVED",
          },
        });

        vendor = await prisma.vendor.create({
          data: {
            userId: user.id,
            storeName: "Café Origen & Artesanías",
            slug: "cafe-origen",
            whatsappNumber: "573001234567",
          },
        });
      }

      // Check category
      let category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        category = await prisma.category.findFirst();
      }

      const product = await prisma.product.create({
        data: {
          title,
          slug,
          price: parseFloat(price),
          stock: parseInt(stock, 10) || 0,
          images: images || [],
          description: description || "",
          categoryId: category ? category.id : categoryId,
          vendorId: vendor.id,
        },
      });

      return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (dbError: any) {
      console.warn("Base de datos no disponible; guardando en memoria de prueba:", dbError.message);
      
      const simulatedProduct = {
        id: `prod_${Date.now()}`,
        title,
        slug,
        price: parseFloat(price),
        stock: parseInt(stock, 10) || 0,
        images: images || [],
        description: description || "",
        isActive: true,
        vendorId: "ven_cafe_1",
        categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      MOCK_PRODUCTS.unshift(simulatedProduct);

      return NextResponse.json(
        {
          success: true,
          product: simulatedProduct,
          notice: "Guardado en catálogo local de prueba.",
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "Error al procesar la creación del producto." },
      { status: 500 }
    );
  }
}
