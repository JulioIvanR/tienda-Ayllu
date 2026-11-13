"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ShieldCheck,
  Store,
  Users,
  LayoutDashboard,
  LogOut,
  User,
  Loader2,
} from "lucide-react";

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "VENDOR";
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Verificar sesión al montar o cambiar de ruta
  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (!active) return;

        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        if (active) {
          console.error("Error al verificar sesión:", error);
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#dfd2be] bg-[#fcf8f0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center group" aria-label="Casa AYLLU - Inicio">
          <img
            src="https://res.cloudinary.com/jwoctsqu/image/upload/v1794581068/AYLLU.webp"
            alt="Casa AYLLU"
            className="h-10 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Botón Inicio (siempre visible) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#2e5e4e] hover:bg-[#a8bca8]/20 rounded-lg transition-colors"
          >
            <Home className="h-4 w-4 text-[#2e5e4e]" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>

          {/* Directorio de Tiendas */}
          <Link
            href="/tiendas"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#2e5e4e] hover:bg-[#a8bca8]/20 rounded-lg transition-colors"
          >
            <Store className="h-4 w-4 text-[#b03917]" />
            <span className="hidden sm:inline">Tiendas</span>
          </Link>

          {/* Nosotros */}
          <Link
            href="/nosotros"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#2e5e4e] hover:bg-[#a8bca8]/20 rounded-lg transition-colors"
          >
            <Users className="h-4 w-4 text-[#2e5e4e]" />
            <span className="hidden sm:inline">Nosotros</span>
          </Link>

          {/* Si está cargando, mostrar loader */}
          {isLoading ? (
            <div className="flex items-center gap-1.5 px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#b03917]" />
            </div>
          ) : user ? (
            <>
              {/* Panel Vendedor - Solo si es VENDOR */}
              {user.role === "VENDOR" && (
                <Link
                  href="/vendedor-panel"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#b03917] hover:bg-[#b03917]/15 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#b03917]" />
                  <span className="hidden sm:inline">Panel Vendedor</span>
                </Link>
              )}

              {/* Super Admin - Solo si es SUPER_ADMIN */}
              {user.role === "SUPER_ADMIN" && (
                <Link
                  href="/admin/categorias"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#5d3805] hover:bg-[#5d3805]/10 rounded-lg transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-[#5d3805]" />
                  <span className="hidden sm:inline">Super Admin</span>
                </Link>
              )}

              {/* User Info y Logout */}
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[#dfd2be]">
                <div className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737]">
                  <User className="h-4 w-4 text-[#2e5e4e]" />
                  <span className="hidden sm:inline truncate max-w-[120px]">
                    {user.email}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
                  </span>
                </button>
              </div>
            </>
          ) : (
            /* Botón Iniciar Sesión - Si NO está autenticado */
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#b03917] hover:bg-[#8f2c0f] rounded-lg transition-colors shadow-md shadow-[#b03917]/25"
            >
              <User className="h-4 w-4" />
              <span>Iniciar sesión</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
