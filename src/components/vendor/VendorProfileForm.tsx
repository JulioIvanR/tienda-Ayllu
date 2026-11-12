"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Store,
  Save,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Loader2,
  AlertCircle,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { slugify, cleanPhoneNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Vendor } from "@/types";

interface VendorProfileFormProps {
  initialVendor: Vendor;
  ownerName: string | null;
  ownerEmail: string;
}

export function VendorProfileForm({
  initialVendor,
  ownerName,
  ownerEmail,
}: VendorProfileFormProps) {
  const router = useRouter();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [storeName, setStoreName] = useState(initialVendor.storeName);
  const [slug, setSlug] = useState(initialVendor.slug);
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialVendor.whatsappNumber || ""
  );
  const [email, setEmail] = useState(initialVendor.email || ownerEmail || "");
  const [phone, setPhone] = useState(initialVendor.phone || "");
  const [address, setAddress] = useState(initialVendor.address || "");
  const [city, setCity] = useState(initialVendor.city || "");
  const [description, setDescription] = useState(
    initialVendor.description || ""
  );
  const [logoUrl, setLogoUrl] = useState(initialVendor.logoUrl || "");
  const [bannerUrl, setBannerUrl] = useState(initialVendor.bannerUrl || "");

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState("");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "logo" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading =
      target === "logo" ? setIsUploadingLogo : setIsUploadingBanner;
    const setUploadError =
      target === "logo" ? setLogoUploadError : setBannerUploadError;
    const setUrl = target === "logo" ? setLogoUrl : setBannerUrl;
    const inputRef = target === "logo" ? logoInputRef : bannerInputRef;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("El archivo supera el límite de 10MB permitido.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.secure_url) {
        throw new Error(
          data.error || "No se pudo subir la imagen a Cloudinary."
        );
      }

      setUrl(data.secure_url);
      setIsSaved(false);
    } catch (err: unknown) {
      console.error("Error al subir a Cloudinary:", err);
      setUploadError(
        err instanceof Error ? err.message : "Error al subir la imagen."
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setIsSaved(false);

    const cleanedSlug = slugify(slug).replace(/^-+|-+$/g, "");
    const cleanedWhatsapp = cleanPhoneNumber(whatsappNumber);

    if (!storeName.trim()) {
      setSaveError("El nombre comercial de la tienda es obligatorio.");
      return;
    }

    if (!cleanedSlug) {
      setSaveError("La ruta / slug de tu mini-tienda es obligatoria.");
      return;
    }

    if (!cleanedWhatsapp || cleanedWhatsapp.length < 7) {
      setSaveError(
        "El número de WhatsApp es obligatorio y debe tener al menos 7 dígitos (incluyendo código de país)."
      );
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          storeName: storeName.trim(),
          slug: cleanedSlug,
          whatsappNumber: cleanedWhatsapp,
          email: email.trim(),
          phone: phone.trim(),
          city: city.trim(),
          address: address.trim(),
          description: description.trim(),
          logoUrl: logoUrl.trim(),
          bannerUrl: bannerUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "No se pudieron guardar los cambios de la tienda."
        );
      }

      if (data.vendor) {
        setStoreName(data.vendor.storeName);
        setSlug(data.vendor.slug);
        setWhatsappNumber(data.vendor.whatsappNumber || "");
        setEmail(data.vendor.email || "");
        setPhone(data.vendor.phone || "");
        setCity(data.vendor.city || "");
        setAddress(data.vendor.address || "");
        setDescription(data.vendor.description || "");
        setLogoUrl(data.vendor.logoUrl || "");
        setBannerUrl(data.vendor.bannerUrl || "");
      }

      setIsSaved(true);
      router.refresh();
    } catch (err: unknown) {
      console.error("Error al guardar perfil de tienda:", err);
      setSaveError(
        err instanceof Error
          ? err.message
          : "Error al guardar los cambios de la tienda."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2e5e4e]">
            Configuración de Tienda &amp; WhatsApp
          </h1>
          <p className="mt-1 text-sm text-[#373737]/75">
            Personaliza la identidad visual de tu mini-tienda y el número telefónico donde recibirás tus pedidos.
          </p>
        </div>

        <Link
          href={`/vendedor/${slug || initialVendor.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#dfd2be] bg-white px-3.5 py-2 text-xs font-bold text-[#2e5e4e] hover:border-[#ca9029] hover:text-[#ca9029] transition-colors shrink-0 self-start"
        >
          <span>Ver mi tienda pública</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Assigned Owner & Store Info */}
      <div className="rounded-2xl border border-[#a8bca8]/60 bg-[#a8bca8]/15 px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#2e5e4e]">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-[#ca9029] shrink-0" />
          <span>
            Vendedor: <strong>{ownerName || ownerEmail}</strong> ({ownerEmail})
          </span>
        </div>
        <span className="font-mono text-[#5d3805] font-semibold">
          Tienda asignada: /{slug || initialVendor.slug}
        </span>
      </div>

      {isSaved && (
        <div className="rounded-xl border border-[#a8bca8] bg-[#a8bca8]/25 p-4 text-sm font-semibold text-[#2e5e4e] flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#ca9029] shrink-0" />
          <span>¡Perfil y configuración de WhatsApp guardados correctamente!</span>
        </div>
      )}

      {saveError && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm font-semibold text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Store Data & WhatsApp */}
        <div className="rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-[#5d3805] font-bold text-sm border-b border-[#dfd2be] pb-3">
            <Store className="h-4 w-4 text-[#ca9029]" />
            <span>Datos Generales de la Tienda</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre Comercial de la Tienda *"
              required
              value={storeName}
              onChange={(e) => {
                setStoreName(e.target.value);
                setIsSaved(false);
              }}
            />

            <div>
              <label className="text-sm font-semibold text-[#373737] block mb-1.5">
                Ruta única / Slug de tu Mini-Tienda *
              </label>
              <div className="flex items-center rounded-xl border border-[#dfd2be] bg-[#f1e7d5] px-3 py-2 text-sm font-mono text-[#5d3805]">
                <span className="text-[#373737]/60">/vendedor/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setIsSaved(false);
                  }}
                  className="bg-transparent font-mono outline-none flex-1 ml-0.5 text-[#2e5e4e] font-bold"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Configuration */}
          <div className="rounded-xl border border-[#dfd2be] bg-[#f1e7d5]/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-[#2e5e4e] font-bold text-sm">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Número de WhatsApp para Recepción de Pedidos *</span>
            </div>
            <p className="text-xs text-[#373737]/80 leading-relaxed">
              Ingresa el código de país seguido del número sin espacios ni símbolos (+) para generar los enlaces{" "}
              <code className="font-mono bg-white border border-[#dfd2be] px-1 py-0.5 rounded text-[#2e5e4e]">
                wa.me/número
              </code>
              . Ejemplo para Colombia: <strong>573001234567</strong>.
            </p>

            <Input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => {
                setWhatsappNumber(cleanPhoneNumber(e.target.value));
                setIsSaved(false);
              }}
              placeholder="573001234567"
              className="font-mono text-base font-bold text-[#2e5e4e]"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Email de Contacto"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsSaved(false);
              }}
            />
            <Input
              label="Teléfono Fijo / Secundario"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setIsSaved(false);
              }}
            />
            <Input
              label="Ciudad / Región"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Ej: Medellín, Colombia"
            />
            <Input
              label="Dirección Física (opcional)"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Ej: Carrera 43A # 1-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-[#373737] block mb-1.5">
              Biografía / Descripción de la Tienda
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Cuéntale a tus clientes sobre tus productos, métodos de entrega y horarios de atención..."
              className="w-full rounded-xl border border-[#dfd2be] bg-white p-3 text-sm text-[#373737] placeholder:text-[#373737]/45 focus:outline-none focus:ring-2 focus:ring-[#ca9029]"
            />
          </div>
        </div>

        {/* Branding & Cloudinary Media Upload */}
        <div className="rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 shadow-xs space-y-5">
          <h3 className="font-bold text-sm text-[#5d3805] border-b border-[#dfd2be] pb-3">
            Imagen e Identidad Visual (Banner y Logotipo)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#373737] block">
                Logotipo (Cuadrado - Cloudinary)
              </label>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "logo")}
                className="hidden"
                disabled={isUploadingLogo}
              />

              {isUploadingLogo || !logoUrl ? (
                <div
                  onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[170px] ${
                    isUploadingLogo
                      ? "border-[#ca9029] bg-[#ca9029]/10 cursor-wait"
                      : "border-[#dfd2be] bg-white/70 hover:border-[#ca9029] hover:bg-[#f1e7d5]/30"
                  }`}
                >
                  {isUploadingLogo ? (
                    <div className="flex flex-col items-center space-y-2 text-[#ca9029] text-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p className="font-bold text-sm">Subiendo logotipo a Cloudinary...</p>
                      <p className="text-xs text-[#373737]/70">
                        Guardando en carpeta <strong>tienda-ayllu-productos</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className="h-11 w-11 rounded-2xl bg-[#ca9029]/15 text-[#ca9029] flex items-center justify-center">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <p className="font-bold text-sm text-[#5d3805]">
                        Haz clic para subir tu logotipo
                      </p>
                      <p className="text-xs text-[#373737]/65">
                        JPG, PNG, WEBP, GIF (máximo 10 MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#dfd2be] bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e5e4e] bg-[#a8bca8]/25 px-2.5 py-1 rounded-lg border border-[#a8bca8]/60">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      {logoUrl.includes("res.cloudinary.com")
                        ? "Guardado en Cloudinary"
                        : "Logotipo actual"}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#ca9029] hover:text-[#b57f22] hover:underline cursor-pointer"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLogoUrl("");
                          setLogoUploadError("");
                          setIsSaved(false);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Quitar
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-[#dfd2be] bg-[#f1e7d5] shrink-0">
                      <img
                        src={logoUrl}
                        alt="Vista previa del logotipo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#5d3805] mb-1">
                        URL de la imagen:
                      </p>
                      <p className="text-xs font-mono text-[#373737]/80 truncate bg-[#f1e7d5]/60 p-2 rounded-lg border border-[#dfd2be]">
                        {logoUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {logoUploadError && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {logoUploadError}
                </p>
              )}
            </div>

            {/* Banner Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#373737] block">
                Banner de Cabecera (Cloudinary)
              </label>

              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "banner")}
                className="hidden"
                disabled={isUploadingBanner}
              />

              {isUploadingBanner || !bannerUrl ? (
                <div
                  onClick={() =>
                    !isUploadingBanner && bannerInputRef.current?.click()
                  }
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[170px] ${
                    isUploadingBanner
                      ? "border-[#ca9029] bg-[#ca9029]/10 cursor-wait"
                      : "border-[#dfd2be] bg-white/70 hover:border-[#ca9029] hover:bg-[#f1e7d5]/30"
                  }`}
                >
                  {isUploadingBanner ? (
                    <div className="flex flex-col items-center space-y-2 text-[#ca9029] text-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p className="font-bold text-sm">Subiendo banner a Cloudinary...</p>
                      <p className="text-xs text-[#373737]/70">
                        Guardando en carpeta <strong>tienda-ayllu-productos</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className="h-11 w-11 rounded-2xl bg-[#ca9029]/15 text-[#ca9029] flex items-center justify-center">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <p className="font-bold text-sm text-[#5d3805]">
                        Haz clic para subir tu banner de cabecera
                      </p>
                      <p className="text-xs text-[#373737]/65">
                        JPG, PNG, WEBP, GIF (máximo 10 MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#dfd2be] bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e5e4e] bg-[#a8bca8]/25 px-2.5 py-1 rounded-lg border border-[#a8bca8]/60">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      {bannerUrl.includes("res.cloudinary.com")
                        ? "Guardado en Cloudinary"
                        : "Banner actual"}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => bannerInputRef.current?.click()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#ca9029] hover:text-[#b57f22] hover:underline cursor-pointer"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        Cambiar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBannerUrl("");
                          setBannerUploadError("");
                          setIsSaved(false);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Quitar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="relative h-24 w-full rounded-xl overflow-hidden border border-[#dfd2be] bg-[#f1e7d5]">
                      <img
                        src={bannerUrl}
                        alt="Vista previa del banner"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-mono text-[#373737]/80 truncate bg-[#f1e7d5]/60 p-2 rounded-lg border border-[#dfd2be]">
                      {bannerUrl}
                    </p>
                  </div>
                </div>
              )}

              {bannerUploadError && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {bannerUploadError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            disabled={isUploadingLogo || isUploadingBanner || isSaving}
          >
            <Save className="h-4 w-4 mr-1.5" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
