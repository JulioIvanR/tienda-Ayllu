import Link from "next/link";
import { Package, PlusCircle, MessageCircle, ExternalLink, Eye } from "lucide-react";
import prisma from "@/lib/prisma";
import { MOCK_VENDORS, MOCK_PRODUCTS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getVendorPanelData() {
  const defaultSlug = "cafe-origen";

  try {
    const dbVendor = await prisma.vendor.findUnique({
      where: { slug: defaultSlug },
      include: {
        products: {
          orderBy: { createdAt: "desc" },
          include: { category: true },
        },
      },
    });

    if (dbVendor) {
      return {
        vendor: dbVendor,
        products: dbVendor.products.map((p) => ({
          ...p,
          price: Number(p.price),
        })),
      };
    }
  } catch (error) {}

  const mockVendor = MOCK_VENDORS[0];
  const mockProducts = MOCK_PRODUCTS.filter((p) => p.vendorId === mockVendor.id);

  return {
    vendor: mockVendor,
    products: mockProducts,
  };
}

export default async function VendorDashboardPage() {
  const { vendor, products } = await getVendorPanelData();

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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{vendor.storeName}</h1>
            <p className="mt-1 text-sm text-[#f1e7d5] max-w-xl">
              Tus clientes compran directamente a través de tu número de WhatsApp{" "}
              <strong className="text-white">+{vendor.whatsappNumber}</strong>.
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
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">Productos en Catálogo</p>
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
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">Unidades en Stock</p>
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
              <p className="text-xs font-bold uppercase tracking-wider text-[#5d3805]/70">Canal de Pedidos</p>
              <p className="text-base font-bold text-[#2e5e4e] mt-1 flex items-center gap-1.5">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                WhatsApp Directo
              </p>
              <p className="text-xs text-[#373737]/70 font-mono">+{vendor.whatsappNumber}</p>
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
        </div>
      </div>
    </div>
  );
}
