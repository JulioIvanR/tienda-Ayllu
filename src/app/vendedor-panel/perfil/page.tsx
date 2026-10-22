"use client";

import { useState } from "react";
import { MessageCircle, Store, Save, Sparkles, ExternalLink } from "lucide-react";
import { MOCK_VENDORS } from "@/lib/mock-data";
import { slugify, cleanPhoneNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function VendorProfilePage() {
  const initial = MOCK_VENDORS[0];

  const [storeName, setStoreName] = useState(initial.storeName);
  const [slug, setSlug] = useState(initial.slug);
  const [whatsappNumber, setWhatsappNumber] = useState(initial.whatsappNumber);
  const [email, setEmail] = useState(initial.email || "");
  const [phone, setPhone] = useState(initial.phone || "");
  const [address, setAddress] = useState(initial.address || "");
  const [city, setCity] = useState(initial.city || "");
  const [description, setDescription] = useState(initial.description || "");
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl || "");
  const [bannerUrl, setBannerUrl] = useState(initial.bannerUrl || "");

  const [isSaved, setIsSaved] = useState(false);

  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Configuración de Tienda & WhatsApp
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Personaliza la identidad visual de tu mini-tienda y el número telefónico donde recibirás tus pedidos.
        </p>
      </div>

      {isSaved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>¡Perfil y configuración de WhatsApp actualizados correctamente!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Store Data & WhatsApp */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold text-sm border-b border-slate-100 pb-3 dark:border-slate-800">
            <Store className="h-4 w-4" />
            <span>Datos Generales de la Tienda</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre Comercial de la Tienda *"
              required
              value={storeName}
              onChange={(e) => handleStoreNameChange(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                Ruta única / Slug de tu Mini-Tienda *
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-mono text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span className="text-slate-400">/vendedor/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="bg-transparent font-mono outline-none flex-1 ml-0.5 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Configuration */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>Número de WhatsApp para Recepción de Pedidos *</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Ingresa el código de país seguido del número sin espacios ni símbolos (+) para generar los enlaces <code className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-700">wa.me/número</code>. Ejemplo para Colombia: <strong>573001234567</strong>.
            </p>

            <Input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(cleanPhoneNumber(e.target.value))}
              placeholder="573001234567"
              className="font-mono text-base font-semibold"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input
              label="Email de Contacto"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Teléfono Fijo / Secundario"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Ciudad / Región"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej: Medellín, Colombia"
            />
            <Input
              label="Dirección Física (opcional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Carrera 43A # 1-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
              Biografía / Descripción de la Tienda
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cuéntale a tus clientes sobre tus productos, métodos de entrega y horarios de atención..."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Branding & Media URLs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
            Imagen e Identidad Visual (Banner y Logotipo)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="URL del Logotipo (Cuadrado)"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
            />
            <Input
              label="URL del Banner de Cabecera"
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="submit" variant="primary">
            <Save className="h-4 w-4 mr-1.5" />
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
