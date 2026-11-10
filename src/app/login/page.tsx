"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión.");
        setIsLoading(false);
        return;
      }

      // Redirigir según el rol
      if (data.user.role === "SUPER_ADMIN") {
        router.push("/admin/categorias");
      } else if (data.user.role === "VENDOR") {
        router.push("/vendedor-panel");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión. Por favor, intenta de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fbf7ee] to-[#f1e7d5] px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-[#dfd2be] bg-white shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2e5e4e] to-[#5d3805] px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#ca9029] flex items-center justify-center">
                <LogIn className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
            <p className="text-[#a8bca8] text-sm mt-2">
              Accede a tu cuenta de Comunidad ILUMINA
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Identifier Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold text-[#2e5e4e] mb-2">
                Correo o Usuario
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="tu@email.com o usuario"
                className="w-full px-4 py-3 rounded-xl border border-[#dfd2be] bg-[#fdfbf6] text-[#2e5e4e] placeholder-[#373737]/50 focus:outline-none focus:ring-2 focus:ring-[#ca9029] focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#2e5e4e] mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[#dfd2be] bg-[#fdfbf6] text-[#2e5e4e] placeholder-[#373737]/50 focus:outline-none focus:ring-2 focus:ring-[#ca9029] focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#ca9029] hover:bg-[#b57f22] text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#ca9029]/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>

            {/* Demo Credentials */}
            <div className="rounded-xl bg-[#a8bca8]/15 border border-[#a8bca8]/30 p-4">
              <p className="text-xs font-semibold text-[#2e5e4e] mb-2">
                📝 Credenciales de Prueba:
              </p>
              <div className="space-y-1 text-xs text-[#373737]/80">
                <p>
                  <strong>Super Admin:</strong> admin@comunidadilumina.com
                </p>
                <p>
                  <strong>Vendor:</strong> info@comunidadilumina.com
                </p>
                <p>
                  <strong>Contraseña:</strong> Aguila&Condor2026
                </p>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#fdfbf6] border-t border-[#dfd2be] text-center text-sm text-[#373737]/70">
            ¿Necesitas ayuda?{" "}
            <Link
              href="/"
              className="text-[#ca9029] hover:text-[#b57f22] font-semibold transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
