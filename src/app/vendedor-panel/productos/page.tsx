import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentSessionUser } from "@/lib/auth";
import { VendorProductsTable } from "@/components/vendor/VendorProductsTable";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export default async function VendorProductsPage() {
  const session = await getCurrentSessionUser();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "VENDOR" || !session.vendor) {
    return (
      <div className="max-w-xl rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#5d3805] font-bold">
          <ShieldAlert className="h-5 w-5 text-[#b03917]" />
          <span>Cuenta sin tienda de vendedor asignada</span>
        </div>
        <p className="text-sm text-[#373737]/80">
          Iniciaste sesión como <strong>{session.email}</strong> ({session.role}), pero esta vista es exclusiva para vendedores.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center rounded-xl bg-[#b03917] px-4 py-2 text-xs font-bold text-white hover:bg-[#8f2c0f]"
        >
          Cambiar de cuenta
        </Link>
      </div>
    );
  }

  const dbProducts = await prisma.product.findMany({
    where: { vendorId: session.vendor.id },
    orderBy: { createdAt: "desc" },
  });

  const products: Product[] = dbProducts.map((p) => ({
    ...p,
    price: Number(p.price),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <VendorProductsTable
      key={session.vendor.id}
      initialProducts={products}
      storeName={session.vendor.storeName}
    />
  );
}
