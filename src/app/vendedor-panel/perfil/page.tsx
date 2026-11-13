import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { getCurrentSessionUser } from "@/lib/auth";
import { VendorProfileForm } from "@/components/vendor/VendorProfileForm";

export const dynamic = "force-dynamic";

export default async function VendorProfilePage() {
  const session = await getCurrentSessionUser();

  if (!session) {
    redirect("/login");
  }

  if (session.status !== "APPROVED") {
    return (
      <div className="max-w-xl rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#5d3805] font-bold">
          <ShieldAlert className="h-5 w-5 text-[#b03917]" />
          <span>Cuenta pendiente de aprobación</span>
        </div>
        <p className="text-sm text-[#373737]/80">
          Tu cuenta ({session.email}) aún no se encuentra aprobada para editar su tienda.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-xl bg-[#b03917] px-4 py-2 text-xs font-bold text-white hover:bg-[#8f2c0f]"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (session.role !== "VENDOR" || !session.vendor) {
    return (
      <div className="max-w-xl rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#5d3805] font-bold">
          <ShieldAlert className="h-5 w-5 text-[#b03917]" />
          <span>Cuenta sin tienda de vendedor asignada</span>
        </div>
        <p className="text-sm text-[#373737]/80">
          Iniciaste sesión como <strong>{session.email}</strong> ({session.role}), pero esta vista es exclusiva para usuarios con rol de vendedor.
        </p>
        <div className="flex items-center gap-3">
          {session.role === "SUPER_ADMIN" && (
            <Link
              href="/admin"
              className="inline-flex items-center rounded-xl bg-[#2e5e4e] px-4 py-2 text-xs font-bold text-white hover:bg-[#244b3e]"
            >
              Ir al Panel Super Admin
            </Link>
          )}
          <Link
            href="/login"
            className="inline-flex items-center rounded-xl bg-[#b03917] px-4 py-2 text-xs font-bold text-white hover:bg-[#8f2c0f]"
          >
            Cambiar de cuenta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <VendorProfileForm
      key={session.vendor.id}
      initialVendor={session.vendor}
      ownerName={session.name}
      ownerEmail={session.email}
    />
  );
}
