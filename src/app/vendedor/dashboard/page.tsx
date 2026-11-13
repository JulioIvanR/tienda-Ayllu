import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  LayoutDashboard,
  Package,
  PlusCircle,
  Store,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Panel Provisional de Vendedor | Tienda AYLLU",
  description:
    "Acceso rápido al panel de gestión de tienda, productos y configuración de WhatsApp.",
};

export default function VendedorDashboard() {
  const quickLinks = [
    {
      title: "Panel Completo de Vendedor",
      description:
        "Consulta el resumen de tu tienda, inventario total y estado de ventas por WhatsApp.",
      href: "/vendedor-panel",
      icon: LayoutDashboard,
      cta: "Abrir panel",
    },
    {
      title: "Perfil de Tienda & WhatsApp",
      description:
        "Actualiza el nombre, slug, descripción, logotipo, banner y número de WhatsApp.",
      href: "/vendedor-panel/perfil",
      icon: Store,
      cta: "Configurar tienda",
    },
    {
      title: "Catálogo de Productos",
      description:
        "Administra los artículos publicados en tu mini-tienda, precios y stock disponible.",
      href: "/vendedor-panel/productos",
      icon: Package,
      cta: "Ver productos",
    },
    {
      title: "Publicar Nuevo Producto",
      description:
        "Sube imágenes a Cloudinary y agrega nuevos artículos a tu catálogo.",
      href: "/vendedor-panel/productos/nuevo",
      icon: PlusCircle,
      cta: "Crear producto",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f1e7d5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Encabezado */}
        <section className="rounded-3xl border border-[#a8bca8] bg-[#a8bca8]/35 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#2e5e4e] border border-[#a8bca8]">
                Vista Provisional de Vendedor
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2e5e4e]">
                Dashboard de Vendedor
              </h1>
              <p className="text-sm text-[#373737]/85 max-w-2xl">
                Desde aquí puedes ingresar al panel completo para administrar tu tienda, catálogo de productos y pedidos directos por WhatsApp.
              </p>
            </div>

            <Link
              href="/vendedor-panel"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#b03917] hover:bg-[#8f2c0f] text-white px-5 py-3 text-sm font-bold shadow-sm transition-colors self-start sm:self-auto shrink-0"
            >
              <span>Ir al Panel Principal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col justify-between rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#b03917] hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#a8bca8]/30 text-[#2e5e4e] flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-[#5d3805] group-hover:text-[#b03917] transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[#373737]/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#b03917]">
                  <span>{item.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </section>

        {/* Pie de navegación */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#dfd2be] pt-6 text-sm">
          <Link
            href="/tiendas"
            className="font-semibold text-[#2e5e4e] hover:text-[#b03917] transition-colors"
          >
            Explorar todas las tiendas &rarr;
          </Link>
          <Link
            href="/"
            className="font-semibold text-[#373737]/75 hover:text-[#2e5e4e] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
