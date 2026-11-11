"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShoppingBag,
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
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Verificar sesión al montar el componente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

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
        console.error("Error al verificar sesión:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#dfd2be] bg-[#fcf8f0]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="https://res.cloudinary.com/jwoctsqu/image/upload/v1794364409/Logo_Ilumina_Escuela_Horizontal_OK.webp"
            alt="Logo Ilumina"
            className="h-9 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-lg tracking-tight text-[#2e5e4e]">
            Tienda AYLLU
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Botón Tienda (siempre visible) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#2e5e4e] hover:bg-[#a8bca8]/20 rounded-lg transition-colors"
          >
            <ShoppingBag className="h-4 w-4 text-[#2e5e4e]" />
            <span className="hidden sm:inline">Tienda</span>
          </Link>

          {/* Si está cargando, mostrar loader */}
          {isLoading ? (
            <div className="flex items-center gap-1.5 px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#ca9029]" />
            </div>
          ) : user ? (
            <>
              {/* Panel Vendedor - Solo si es VENDOR */}
              {user.role === "VENDOR" && (
                <Link
                  href="/vendedor-panel"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-[#ca9029] hover:bg-[#ca9029]/15 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#ca9029]" />
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
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#373737] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#ca9029] hover:bg-[#b57f22] rounded-lg transition-colors shadow-md shadow-[#ca9029]/25"
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
