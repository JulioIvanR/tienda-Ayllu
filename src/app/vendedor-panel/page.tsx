import Link from "next/link";
import { Package, PlusCircle, MessageCircle, ExternalLink, ArrowRight, Eye } from "lucide-react";
import prisma from "@/lib/prisma";
import { MOCK_VENDORS, MOCK_PRODUCTS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getVendorPanelData() {
  // Use vendor "cafe-origen" as active demo vendor session
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
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                Panel de Vendedor
              </span>
              <Badge variant="success" className="bg-emerald-500/20 text-white border-white/20">
                Tienda Verificada
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{vendor.storeName}</h1>
            <p className="mt-1 text-sm text-emerald-100 max-w-xl">
              Tus clientes compran directamente a través de tu número de WhatsApp{" "}
              <strong>+{vendor.whatsappNumber}</strong>.
            </p>
          </div>

          <Link
            href={`/vendedor/${vendor.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl bg-white text-emerald-800 px-5 py-3 text-sm font-bold shadow-md hover:bg-emerald-50 transition-all self-start sm:self-auto"
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
              <p className="text-xs font-semibold uppercase text-slate-400">Productos en Catálogo</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {products.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-950 dark:text-indigo-400">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Unidades en Stock</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {totalStock}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950 dark:text-emerald-400">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Canal de Pedidos</p>
              <p className="text-base font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Directo
              </p>
              <p className="text-xs text-slate-400 font-mono">+{vendor.whatsappNumber}</p>
            </div>
            <Link
              href="/vendedor-panel/perfil"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline dark:hover:text-slate-200"
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Mis Productos Recientes
            </h2>
            <p className="text-xs text-slate-500">
              Inventario disponible en tu mini-tienda pública.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/vendedor-panel/productos"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Ver todos ({products.length})
            </Link>
            <Link
              href="/vendedor-panel/productos/nuevo"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-semibold shadow-xs"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Nuevo Producto</span>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-200 text-xs">
                        Img
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      /producto/{product.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white text-sm block">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-xs text-slate-400">
                      Stock: {product.stock} un
                    </span>
                  </div>

                  <Link
                    href={`/producto/${product.slug}`}
                    target="_blank"
                    className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
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
