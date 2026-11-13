import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Nosotros | Casa AYLLU",
  description:
    "Un ecommerce que nace como una vitrina para todos esos proyectos, emprendimientos y servicios de la comunidad de estudiantes de ILUMINA.",
};

export default function NosotrosPage() {
  return (
    <div className="bg-[#f1e7d5] min-h-screen text-[#373737] overflow-hidden">
      {/* 1. SECCIÓN HERO */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-14 sm:pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Texto principal */}
          <div className="lg:col-span-7 z-10">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-6 sm:mb-8">
              <span className="h-0.5 w-6 bg-[#b03917]" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#b03917]">
                Nosotros
              </span>
            </div>

            {/* Título principal con jerarquía visual de dos niveles */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-[#2e5e4e] tracking-tight leading-none">
                Un ecommerce que nace
              </h1>
              <p className="text-xl sm:text-2xl lg:text-[26px] font-medium text-[#2e5e4e] leading-snug max-w-xl">
                como una vitrina para todos esos proyectos<br className="hidden sm:inline" />
                {" "}emprendimientos y servicios de la comunidad de<br className="hidden sm:inline" />
                {" "}estudiantes de ILUMINA
              </p>
            </div>

            {/* Párrafo inferior con espaciado amplio */}
            <p className="text-xs sm:text-sm text-[#373737]/80 max-w-md mt-10 sm:mt-16 leading-relaxed">
              Detrás de cada creación de Casa Ayllu hay una persona que decidió<br className="hidden sm:inline" />
              {" "}mirarse por dentro, y una comunidad que la acompañó a hacerlo.
            </p>
          </div>

          {/* Gráfico decorativo de constelación / geometría sagrada */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end pointer-events-none select-none">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 opacity-65">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full text-[#b03917]/30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Círculos concéntricos */}
                <circle
                  cx="200"
                  cy="200"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="165"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="190"
                  stroke="currentColor"
                  strokeWidth="0.8"
                />

                {/* Líneas de constelación */}
                <line
                  x1="80"
                  y1="120"
                  x2="200"
                  y2="200"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <line
                  x1="320"
                  y1="140"
                  x2="200"
                  y2="200"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <line
                  x1="120"
                  y1="300"
                  x2="200"
                  y2="200"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <line
                  x1="290"
                  y1="280"
                  x2="200"
                  y2="200"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <line
                  x1="80"
                  y1="120"
                  x2="150"
                  y2="60"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <line
                  x1="320"
                  y1="140"
                  x2="350"
                  y2="220"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <line
                  x1="120"
                  y1="300"
                  x2="200"
                  y2="360"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />

                {/* Nodos */}
                <circle cx="200" cy="200" r="4.5" fill="currentColor" />
                <circle cx="80" cy="120" r="3.5" fill="currentColor" />
                <circle cx="320" cy="140" r="3.5" fill="currentColor" />
                <circle cx="120" cy="300" r="4" fill="currentColor" />
                <circle cx="290" cy="280" r="3.5" fill="currentColor" />
                <circle cx="150" cy="60" r="3" fill="currentColor" />
                <circle cx="350" cy="220" r="3" fill="currentColor" />
                <circle cx="200" cy="360" r="3.5" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN: DE DÓNDE VENIMOS (ESCUELA ILUMINA) */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Columna Texto */}
          <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#b03917]" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#b03917]">
                De dónde venimos
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2e5e4e] leading-snug">
              Somos la comunidad de la Escuela ILUMINA
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#373737]/85 leading-relaxed">
              <p>
                <strong className="text-[#2e5e4e] font-semibold">ILUMINA</strong> es
                una escuela de transformación humana nacida en Colombia. A través
                del método <em>Awake Nous</em> acompañamos a las personas a
                despertar su consciencia, sanar su historia y reconocer quiénes son
                en esencia, para que vivan y sirvan desde ese lugar.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://esilumina.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#b03917] hover:text-[#8f2c0f] transition-colors"
              >
                <span>Conoce la Escuela ILUMINA</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Columna Imagen */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden border border-[#dfd2be] bg-[#fdfbf6] shadow-md group">
              <img
                src="https://res.cloudinary.com/jwoctsqu/image/upload/v1794583355/MVIMG_20260704_083329.jpg"
                alt="Espacio campestre de la Escuela ILUMINA"
                className="w-full h-80 sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: POR QUÉ CREAMOS CASA AYLLU (BANNER VERDE OSCURO) */}
      <section className="relative bg-[#2e5e4e] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 my-8 overflow-hidden">
        {/* Marca de agua concéntrica en el fondo */}
        <div className="absolute -right-20 -top-20 w-[480px] h-[480px] sm:w-[620px] sm:h-[620px] pointer-events-none opacity-15">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full text-white"
            fill="none"
          >
            <circle cx="250" cy="250" r="100" stroke="currentColor" strokeWidth="2" />
            <circle cx="250" cy="250" r="160" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="240" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="relative max-w-3xl mx-auto text-center space-y-6 z-10">
          <div className="inline-flex items-center gap-2 justify-center">
            <span className="h-0.5 w-6 bg-[#dfd2be]/60" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#dfd2be]">
              Por qué creamos Casa Ayllu
            </span>
            <span className="h-0.5 w-6 bg-[#dfd2be]/60" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Por qué creamos Casa Ayllu
          </h2>

          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl mx-auto">
            Muchos de nuestros estudiantes crean productos y ofrecen servicios: aromaterapia, cosmética natural, arte, libros, sesiones de coaching y terapias. Creamos Casa Ayllu para darles un lugar donde mostrar su trabajo y llegar a más personas, con el respaldo de la Escuela.
          </p>

          <div className="pt-6">
            <div className="h-px bg-white/20 w-36 mx-auto mb-6" />
            <blockquote className="italic text-base sm:text-lg text-[#dfd2be] font-serif leading-relaxed max-w-xl mx-auto">
              &ldquo;Ayllu es una palabra andina que significa comunidad: un grupo que se apoya para que cada uno de sus miembros pueda crecer. Eso es lo que queremos que sea esta tienda.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN: LO QUE DEBES SABER (TRES PILARES) */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 justify-center">
            <span className="h-0.5 w-6 bg-[#b03917]" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#b03917]">
              Lo que debes saber
            </span>
            <span className="h-0.5 w-6 bg-[#b03917]" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2e5e4e]">
            Lo que debes saber
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Pilar 1 */}
          <div className="group rounded-3xl border border-[#dfd2be] bg-[#fdfbf6] p-7 sm:p-8 shadow-xs hover:shadow-md hover:border-[#b03917]/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-[#b03917]/10 text-[#b03917] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#5d3805]">
                Vendedores de la comunidad
              </h3>
              <p className="text-sm text-[#373737]/80 leading-relaxed">
                Todas las tiendas pertenecen a estudiantes o egresados de ILUMINA.
              </p>
            </div>
          </div>

          {/* Pilar 2 */}
          <div className="group rounded-3xl border border-[#dfd2be] bg-[#fdfbf6] p-7 sm:p-8 shadow-xs hover:shadow-md hover:border-[#b03917]/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-[#b03917]/10 text-[#b03917] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#5d3805]">
                Tiendas revisadas
              </h3>
              <p className="text-sm text-[#373737]/80 leading-relaxed">
                Antes de publicarse, cada tienda y sus productos son revisados por el equipo de la Escuela.
              </p>
            </div>
          </div>

          {/* Pilar 3 */}
          <div className="group rounded-3xl border border-[#dfd2be] bg-[#fdfbf6] p-7 sm:p-8 shadow-xs hover:shadow-md hover:border-[#b03917]/50 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-[#b03917]/10 text-[#b03917] flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#5d3805]">
                Compra directa por WhatsApp
              </h3>
              <p className="text-sm text-[#373737]/80 leading-relaxed">
                Eliges tus productos, envías tu pedido y acuerdas el pago y la entrega directamente con el vendedor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN: BANNER FINAL CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 max-w-5xl mx-auto">
        <div className="relative rounded-3xl border border-[#dfd2be] bg-[#fcf8f0] p-8 sm:p-12 shadow-sm overflow-hidden">
          {/* Fondo geométrico sutil */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 pointer-events-none opacity-40">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full text-[#b03917]/20"
              fill="none"
            >
              <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
            </svg>
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#b03917]" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#b03917]">
                Las puertas están abiertas
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e5e4e]">
              Empieza a recorrer
            </h2>
            <p className="text-sm sm:text-base text-[#373737]/80">
              Explora las tiendas y encuentra lo que necesitas.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/tiendas"
                className="inline-flex items-center gap-2 rounded-xl bg-[#b03917] hover:bg-[#8f2c0f] text-white px-5 py-3 text-sm font-bold shadow-sm transition-all hover:scale-[1.02]"
              >
                <span>Ver tiendas</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 rounded-xl border border-[#dfd2be] bg-white hover:border-[#b03917] hover:text-[#b03917] text-[#373737] px-5 py-3 text-sm font-semibold transition-all shadow-2xs"
              >
                <span>Abrir mi tienda</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
