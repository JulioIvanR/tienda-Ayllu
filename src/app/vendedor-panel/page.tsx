import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  PlusCircle,
  MessageCircle,
  ExternalLink,
  Eye,
  ShieldAlert,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentSessionUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function VendorDashboardPage() {
  const session = await getCurrentSessionUser();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "VENDOR" || !session.vendor) {
    return (
      <div className="max-w-xl rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#5d3805] font-bold">
          <ShieldAlert className="h-5 w-5 text-[#ca9029]" />
          <span>Cuenta sin tienda de vendedor asignada</span>
        </div>
        <p className="text-sm text-[#373737]/80">
          Iniciaste sesión como <strong>{session.email}</strong> ({session.role}), pero este panel corresponde a usuarios vendedores.
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
            className="inline-flex items-center rounded-xl bg-[#ca9029] px-4 py-2 text-xs font-bold text-white hover:bg-[#b57f22]"
          >
            Cambiar de cuenta
          </Link>
        </div>
      </div>
    );
  }

  const vendor = session.vendor;
  const dbProducts = await prisma.product.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const products = dbProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="rounded-3xl bg-gradient-to-r from-[#2e5e4e] via-[#5d3805] to-[#ca9029] p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#a8bca8]">
                Panel de Vendedor
              </span>
              <Badge variant="success" className="bg-[#a8bca8]/25 text-white border-white/20">
                Tienda Verificada
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {vendor.storeName}
            </h1>
            <p className="mt-1 text-sm text-[#f1e7d5] max-w-xl">
              {vendor.whatsappNumber ? (
                <>
                  Tus clientes compran directamente a través de tu número de WhatsApp{" "}
                  <strong className="text-white">+{vendor.whatsappNumber}</strong>.
                </>
              ) : (
                <>
                  Configura tu número de WhatsApp en{" "}
                  <Link href="/vendedor-panel/perfil" className="underline font-bold text-white">
                    Perfil de Tienda
                  </Link>{" "}
                  para recibir pedidos directos.
                </>
              )}
            </p>
          </div>

          <Link
            href={`/vendedor/${vendor.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-5 py-3 text-sm font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <Eye className="h-4 w-4" />
            <span>Ver mi tienda pública</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">
                Productos en Catálogo
              </p>
              <p className="text-3xl font-black text-[#2e5e4e] mt-1">
                {products.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-[#a8bca8]/30 text-[#2e5e4e] flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">
                Unidades en Stock
              </p>
              <p className="text-3xl font-black text-[#ca9029] mt-1">
                {totalStock}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-[#ca9029]/15 text-[#ca9029] flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">
                Canal de Pedidos
              </p>
              <p className="text-base font-bold text-[#2e5e4e] mt-1 flex items-center gap-1.5">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                WhatsApp Directo
              </p>
              <p className="text-xs text-[#373737]/70 font-mono">
                {vendor.whatsappNumber ? `+${vendor.whatsappNumber}` : "Sin configurar"}
              </p>
            </div>
            <Link
              href="/vendedor-panel/perfil"
              className="text-xs font-bold text-[#ca9029] hover:underline"
            >
              Editar
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2e5e4e]">
              Mis Productos Recientes
            </h2>
            <p className="text-xs text-[#373737]/75">
              Inventario disponible en tu mini-tienda pública.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendedor-panel/productos"
              className="text-xs font-bold text-[#ca9029] hover:underline"
            >
              Ver todos ({products.length})
            </Link>
            <Link
              href="/vendedor-panel/productos/nuevo"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-3.5 py-2 text-xs font-bold shadow-2xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Nuevo Producto</span>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] shadow-xs">
          {products.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-[#5d3805]">
                Aún no tienes productos publicados en {vendor.storeName}.
              </p>
              <Link
                href="/vendedor-panel/productos/nuevo"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#ca9029] hover:bg-[#b57f22] text-white px-4 py-2 text-xs font-bold"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Publicar mi primer producto</span>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#dfd2be]">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 hover:bg-[#f1e7d5]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#e8ded0] shrink-0 border border-[#dfd2be]">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-[#f1e7d5] text-xs text-[#373737]">
                          Img
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#5d3805] text-sm">
                        {product.title}
                      </h3>
                      <p className="text-xs text-[#373737]/60 font-mono">
                        /producto/{product.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="font-bold text-[#ca9029] text-sm block">
                        {formatCurrency(product.price)}
                      </span>
                      <span className="text-xs text-[#373737]/65">
                        Stock: {product.stock} un
                      </span>
                    </div>

                    <Link
                      href={`/producto/${product.slug}`}
                      target="_blank"
                      className="p-2 text-[#373737]/60 hover:text-[#ca9029] rounded-lg hover:bg-[#a8bca8]/20 transition-colors"
                      title="Ver página de venta"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
