import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }
    if (session.role !== "VENDOR" || !session.vendor) {
      return NextResponse.json(
        { error: "No tienes una tienda asignada." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true, vendorId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Producto no encontrado." },
        { status: 404 }
      );
    }

    if (existing.vendorId !== session.vendor.id) {
      return NextResponse.json(
        { error: "No tienes permiso para modificar este producto." },
        { status: 403 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(typeof body.isActive === "boolean"
          ? { isActive: body.isActive }
          : {}),
      },
    });

    return NextResponse.json(
      {
        success: true,
        product: {
          ...updated,
          price: Number(updated.price),
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { error: "Error en el servidor." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }
    if (session.role !== "VENDOR" || !session.vendor) {
      return NextResponse.json(
        { error: "No tienes una tienda asignada." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true, vendorId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Producto no encontrado." },
        { status: 404 }
      );
    }

    if (existing.vendorId !== session.vendor.id) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar este producto." },
        { status: 403 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { error: "Error en el servidor." },
      { status: 500 }
    );
  }
}
