import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No se encontró ningún archivo en la petición (campo 'file')." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary folder "tienda-ayllu-productos"
    const uploadResponse = await new Promise<{
      secure_url: string;
      public_id: string;
      format: string;
      bytes: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "tienda-ayllu-productos",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Error desconocido al subir a Cloudinary"));
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              bytes: result.bytes,
            });
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json(
      {
        success: true,
        secure_url: uploadResponse.secure_url,
        public_id: uploadResponse.public_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al subir imagen a Cloudinary:", error);
    return NextResponse.json(
      {
        error: "Error al procesar la subida del archivo a Cloudinary.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
