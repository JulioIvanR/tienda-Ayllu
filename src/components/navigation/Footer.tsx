import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#dfd2be] bg-[#ebe1ce] py-10 text-[#373737]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#2e5e4e] text-lg">Tienda AYLLU</span>
            <span className="text-sm text-[#373737]/80">
              — Plataforma multivendedor con checkout y contacto directo vía WhatsApp.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-[#373737]/80">
            <Link href="/" className="hover:text-[#ca9029] transition-colors">
              Inicio
            </Link>
            <Link href="/tiendas" className="hover:text-[#ca9029] transition-colors">
              Tiendas
            </Link>
            <Link href="/vendedor-panel" className="hover:text-[#ca9029] transition-colors">
              Vendedores
            </Link>
            <Link href="/admin" className="hover:text-[#ca9029] transition-colors">
              Super Admin
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-[#dfd2be] pt-6 text-xs text-[#373737]/75 sm:flex-row">
          <p className="flex items-center gap-1">
            Construido con Next.js (App Router), Tailwind CSS &amp; Prisma ORM.
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[#2e5e4e] font-semibold sm:mt-0">
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            <span>Redirección nativa a WhatsApp API (wa.me)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
