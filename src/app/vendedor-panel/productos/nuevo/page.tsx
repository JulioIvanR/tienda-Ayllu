"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle, Sparkles, Image as ImageIcon } from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [categoryId, setCategoryId] = useState(MOCK_CATEGORIES[0]?.id || "");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/vendedor-panel/productos");
      }, 1200);
    }, 600);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link
          href="/vendedor-panel/productos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Volver al catálogo</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Publicar Nuevo Producto
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Los datos ingresados se usarán para generar tu catálogo y el link de redirección a WhatsApp.
        </p>
      </div>

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
          <h3 className="font-bold text-lg">¡Producto publicado con éxito!</h3>
          <p className="text-sm mt-1">Redirigiendo a tu lista de productos...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5 dark:border-slate-800 dark:bg-slate-900">
            {/* Title & Slug */}
            <div className="space-y-4">
              <Input
                label="Nombre del Producto *"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ej: Café Especial Tueste Medio 500g"
              />

              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">
                  Slug / URL amigable (generado automáticamente)
                </label>
                <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span>/producto/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    className="bg-transparent font-mono outline-none flex-1 ml-0.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Price, Stock & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Precio unitario ($ COP) *"
                type="number"
                required
                min="0"
                step="500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej: 35000"
              />

              <Input
                label="Stock disponible *"
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Ej: 20"
              />

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                  Categoría *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {MOCK_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <Input
                label="URL de Imagen Principal *"
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                helperText="Pega el enlace a la imagen del producto (Unsplash, Cloudinary, AWS S3, etc.)"
              />
              {imageUrl && (
                <div className="mt-3 relative h-32 w-32 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={imageUrl}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as any).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                Descripción detallada *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los beneficios, especificaciones técnicas, materiales o instrucciones de tu producto..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link href="/vendedor-panel/productos">
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Publicar en mi Tienda
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
