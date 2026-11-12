import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getCurrentSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSessionUser(req);

    if (!session || session.status !== "APPROVED") {
      const response = NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      );
      if (session && session.status !== "APPROVED") {
        response.cookies.set(AUTH_COOKIE_NAME, "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 0,
          path: "/",
        });
      }
      return response;
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: session.id,
          email: session.email,
          name: session.name,
          role: session.role,
          status: session.status,
          vendor: session.vendor,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al consultar sesión:", error);
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }
}
