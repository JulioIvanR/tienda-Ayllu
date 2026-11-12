import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSessionUser, serializeVendor } from "@/lib/auth";
import { cleanPhoneNumber, slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSessionUser(req);

    if (!session) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para ver el perfil de tu tienda." },
        { status: 401 }
      );
    }

    if (session.role !== "VENDOR" || !session.vendor) {
      return NextResponse.json(
        { error: "Esta cuenta no tiene una tienda de vendedor asignada." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        vendor: session.vendor,
        owner: {
          id: session.id,
          name: session.name,
          email: session.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener perfil de tienda:", error);
    return NextResponse.json(
      { error: "Error interno al cargar el perfil de la tienda." },
      { status: 500 }
    );
  }
}

async function updateVendorProfile(req: NextRequest) {
  try {
    const session = await getCurrentSessionUser(req);

    if (!session) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para guardar cambios en tu tienda." },
        { status: 401 }
      );
    }

    if (session.role !== "VENDOR" || !session.vendor) {
      return NextResponse.json(
        { error: "Esta cuenta no tiene una tienda de vendedor asignada." },
        { status: 403 }
      );
    }

    if (session.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Tu cuenta aún no está aprobada para actualizar la tienda." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const cleanStoreName =
      typeof body.storeName === "string" ? body.storeName.trim() : "";
    const cleanSlug =
      typeof body.slug === "string"
        ? slugify(body.slug).replace(/^-+|-+$/g, "")
        : "";
    const cleanWhatsapp =
      typeof body.whatsappNumber === "string"
        ? cleanPhoneNumber(body.whatsappNumber)
        : "";
    const cleanEmail =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const cleanPhone =
      typeof body.phone === "string" ? body.phone.trim() : "";
    const cleanCity = typeof body.city === "string" ? body.city.trim() : "";
    const cleanAddress =
      typeof body.address === "string" ? body.address.trim() : "";
    const cleanDescription =
      typeof body.description === "string" ? body.description.trim() : "";
    const cleanLogoUrl =
      typeof body.logoUrl === "string" ? body.logoUrl.trim() : "";
    const cleanBannerUrl =
      typeof body.bannerUrl === "string" ? body.bannerUrl.trim() : "";

    if (!cleanStoreName) {
      return NextResponse.json(
        { error: "El nombre comercial de la tienda es obligatorio." },
        { status: 400 }
      );
    }

    if (!cleanSlug) {
      return NextResponse.json(
        { error: "La ruta / slug de tu mini-tienda es obligatoria." },
        { status: 400 }
      );
    }

    if (!cleanWhatsapp || cleanWhatsapp.length < 7) {
      return NextResponse.json(
        {
          error:
            "El número de WhatsApp es obligatorio y debe incluir código de país (mínimo 7 dígitos).",
        },
        { status: 400 }
      );
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Por favor ingresa un correo de contacto válido." },
        { status: 400 }
      );
    }

    const conflictingSlug = await prisma.vendor.findFirst({
      where: {
        slug: cleanSlug,
        NOT: { id: session.vendor.id },
      },
      select: { id: true },
    });

    if (conflictingSlug) {
      return NextResponse.json(
        {
          error:
            "Esta ruta / slug ya está en uso por otra tienda. Por favor elige otra.",
        },
        { status: 409 }
      );
    }

    const updated = await prisma.vendor.update({
      where: { id: session.vendor.id },
      data: {
        storeName: cleanStoreName,
        slug: cleanSlug,
        whatsappNumber: cleanWhatsapp,
        email: cleanEmail || null,
        phone: cleanPhone || null,
        city: cleanCity || null,
        address: cleanAddress || null,
        description: cleanDescription || null,
        logoUrl: cleanLogoUrl || null,
        bannerUrl: cleanBannerUrl || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        vendor: serializeVendor(updated),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar perfil de tienda:", error);
    return NextResponse.json(
      { error: "Error en el servidor al guardar los cambios." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  return updateVendorProfile(req);
}

export async function PUT(req: NextRequest) {
  return updateVendorProfile(req);
}
