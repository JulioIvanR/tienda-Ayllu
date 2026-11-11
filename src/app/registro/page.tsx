"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2, CheckCircle, UserPlus } from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validaciones
    if (!name || !storeName || !email || !password || !confirmPassword) {
      setError("Todos los campos son requeridos.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          storeName,
          email,
          password,
          role: "VENDOR",
          approved: false,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al crear la cuenta.");
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);

      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión. Por favor, intenta de nuevo.");
      setIsLoading(false);
    }
  };

  // Pantalla de éxito
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fbf7ee] to-[#f1e7d5] px-4">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-[#dfd2be] bg-white shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#2e5e4e] to-[#5d3805] px-6 py-8 text-center">
              <CheckCircle className="h-12 w-12 text-white mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white">¡Registro Completado!</h1>
            </div>

            <div className="p-6 text-center">
              <p className="text-[#2e5e4e] font-semibold mb-2">
                Tu cuenta de tienda está en revisión.
              </p>
              <p className="text-[#373737]/70 text-sm mb-6">
                Requiere aprobación del administrador para iniciar sesión. Serás redirigido al login en unos momentos...
              </p>
              <Loader2 className="h-6 w-6 animate-spin text-[#ca9029] mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de registro
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fbf7ee] to-[#f1e7d5] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-[#dfd2be] bg-white shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2e5e4e] to-[#5d3805] px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#ca9029] flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">Registra tu Tienda</h1>
            <p className="text-[#a8bca8] text-sm mt-2">
              Únete a Tienda AYLLU como vendedor
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

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#2e5e4e] mb-2">
                Nombre Completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl border border-[#dfd2be] bg-[#fdfbf6] text-[#2e5e4e] placeholder-[#373737]/50 focus:outline-none focus:ring-2 focus:ring-[#ca9029] focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
            </div>

            {/* Store Name Field */}
            <div>
              <label htmlFor="storeName" className="block text-sm font-semibold text-[#2e5e4e] mb-2">
                Nombre de la Tienda
              </label>
              <input
                id="storeName"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Nombre de tu tienda"
                className="w-full px-4 py-3 rounded-xl border border-[#dfd2be] bg-[#fdfbf6] text-[#2e5e4e] placeholder-[#373737]/50 focus:outline-none focus:ring-2 focus:ring-[#ca9029] focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#2e5e4e] mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#2e5e4e] mb-2">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span>Registrando tienda...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Registrar Tienda</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#fdfbf6] border-t border-[#dfd2be] text-center text-sm text-[#373737]/70">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-[#ca9029] hover:text-[#b57f22] font-semibold transition-colors"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
