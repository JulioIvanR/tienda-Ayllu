import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#dfd2be] bg-[#ebe1ce] py-6 sm:py-8 text-[#373737]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo y descripción */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
            <Link href="/" className="inline-flex items-center shrink-0">
              <img
                src="https://res.cloudinary.com/jwoctsqu/image/upload/v1794441229/tienda-ayllu-productos/h1yy5jswr7naspwlronx.png"
                alt="Escuela ILUMINA"
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </Link>
            <span className="text-xs sm:text-sm text-[#373737]/80">
              Plataforma Multivendedor de la comunidad ILUMINA
            </span>
          </div>

          {/* Enlaces de navegación */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs sm:text-sm text-[#373737]/80">
            <Link href="/" className="hover:text-[#b03917] transition-colors">
              Inicio
            </Link>
            <Link href="/tiendas" className="hover:text-[#b03917] transition-colors">
              Tiendas
            </Link>
            <Link href="/nosotros" className="hover:text-[#b03917] transition-colors">
              Nosotros
            </Link>
            <Link href="/vendedor-panel" className="hover:text-[#b03917] transition-colors">
              Vendedores
            </Link>
            <Link href="/admin" className="hover:text-[#b03917] transition-colors">
              Super Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
