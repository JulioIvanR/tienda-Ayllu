"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Loader2,
  AlertCircle,
  Plus,
  Tag,
  Clock,
} from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/mock-data";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Category } from "@/types";

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");

  // Categories & Request state
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [categoryId, setCategoryId] = useState(MOCK_CATEGORIES[0]?.id || "");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [isRequestingCat, setIsRequestingCat] = useState(false);
  const [catRequestMessage, setCatRequestMessage] = useState("");
  const [catRequestError, setCatRequestError] = useState("");

  // Cloudinary Image state
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch updated categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
            if (!categoryId) {
              setCategoryId(data.categories[0].id);
            }
          }
        }
      } catch (err) {
        console.warn("Using fallback categories:", err);
      }
    }
    loadCategories();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("El archivo supera el límite de 10MB permitido.");
      return;
    }

    setIsUploading(true);
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
        throw new Error(data.error || "No se pudo subir la imagen a Cloudinary.");
      }

      setImageUrl(data.secure_url);
    } catch (err: any) {
      console.error("Error al subir a Cloudinary:", err);
      setUploadError(err.message || "Error al subir la imagen.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setUploadError("");
  };

  const handleRequestCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setCatRequestError("Por favor escribe el nombre de la categoría.");
      return;
    }

    setIsRequestingCat(true);
    setCatRequestError("");
    setCatRequestMessage("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.category) {
        throw new Error(data.error || "No se pudo procesar la solicitud.");
      }

      const createdCat = data.category;
      setCategories((prev) => [createdCat, ...prev]);
      setCategoryId(createdCat.id);
      setCatRequestMessage(
        `¡Categoría "${createdCat.name}" solicitada con éxito! ` +
        `Ha sido seleccionada para tu producto y quedará visible una vez sea aprobada por el administrador. ` +
        `Recibirás una notificación cuando esto ocurra.`
      );
      setNewCatName("");
      setNewCatDesc("");
      setShowCategoryModal(false);
    } catch (err: any) {
      console.error(err);
      setCatRequestError(err.message || "Error al solicitar la categoría.");
    } finally {
      setIsRequestingCat(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      setUploadError("Por favor sube una imagen para el producto antes de publicar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          categoryId,
          images: [imageUrl],
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar el producto.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/vendedor-panel/productos");
      }, 1200);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al guardar el producto.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link
          href="/vendedor-panel/productos"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ca9029] hover:underline mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Volver al catálogo</span>
        </Link>
        <h1 className="text-2xl font-bold text-[#2e5e4e]">
          Publicar Nuevo Producto
        </h1>
        <p className="mt-1 text-sm text-[#373737]/75">
          Sube la imagen a Cloudinary, asocia o solicita una categoría y completa los detalles de tu producto para Tienda AYLLU.
        </p>
      </div>

      {success ? (
        <div className="rounded-2xl border border-[#a8bca8] bg-[#a8bca8]/25 p-6 text-center text-[#2e5e4e]">
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-[#ca9029]" />
          <h3 className="font-bold text-lg">¡Producto publicado con éxito!</h3>
          <p className="text-sm mt-1">Redirigiendo a tu lista de productos...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-[#dfd2be] bg-[#fdfbf6] p-6 shadow-xs space-y-5">
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
                <label className="text-xs font-semibold text-[#5d3805] block mb-1">
                  Slug / URL amigable (generado automáticamente)
                </label>
                <div className="flex items-center rounded-xl border border-[#dfd2be] bg-[#f1e7d5] px-3 py-2 text-xs font-mono text-[#5d3805]">
                  <span>/producto/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    className="bg-transparent font-mono outline-none flex-1 ml-0.5 text-[#2e5e4e] font-bold"
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

              {/* Category Selector with Request Option */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-[#373737]">
                    Categoría *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(!showCategoryModal)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#ca9029] hover:underline cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Solicitar nueva</span>
                  </button>
                </div>

                <select
                  value={categoryId}
                  onChange={(e) => {
                    if (e.target.value === "NEW_REQUEST") {
                      setShowCategoryModal(true);
                    } else {
                      setCategoryId(e.target.value);
                    }
                  }}
                  className="w-full h-10 rounded-xl border border-[#dfd2be] bg-white px-3 py-2 text-sm text-[#373737] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#ca9029]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.status === "PENDING" ? "(⏳ Pendiente de aprobación)" : ""}
                    </option>
                  ))}
                  <option value="NEW_REQUEST" className="font-bold text-[#ca9029]">
                    + Solicitar nueva categoría al administrador...
                  </option>
                </select>
              </div>
            </div>

            {/* Request Category Collapsible Form */}
            {showCategoryModal && (
              <div className="rounded-2xl border border-[#ca9029]/50 bg-[#ca9029]/10 p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#5d3805] font-bold text-sm">
                    <Tag className="h-4 w-4 text-[#ca9029]" />
                    <span>Solicitar Nueva Categoría al Super Administrador</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="text-xs font-bold text-[#373737]/60 hover:text-[#5d3805] cursor-pointer"
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <div className="rounded-xl border border-[#dfd2be] bg-white/80 p-3 text-xs text-[#373737] leading-relaxed flex items-start gap-2">
                  <Clock className="h-4 w-4 text-[#ca9029] shrink-0 mt-0.5" />
                  <span>
                    La categoría solicitada se creará con estado <strong>"Pendiente"</strong> y será evaluada por el <strong>Super Administrador</strong> en su panel. Puedes seleccionarla y publicar tu producto de inmediato.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#373737] block mb-1">
                      Nombre de la nueva categoría *
                    </label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Ej: Joyería & Accesorios"
                      className="w-full rounded-xl border border-[#dfd2be] bg-white px-3 py-2 text-sm text-[#373737] placeholder:text-[#373737]/45 focus:outline-none focus:ring-2 focus:ring-[#ca9029]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#373737] block mb-1">
                      Descripción breve (opcional)
                    </label>
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="Ej: Joyas artesanales, collares y pulseras"
                      className="w-full rounded-xl border border-[#dfd2be] bg-white px-3 py-2 text-sm text-[#373737] placeholder:text-[#373737]/45 focus:outline-none focus:ring-2 focus:ring-[#ca9029]"
                    />
                  </div>
                </div>

                {catRequestError && (
                  <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {catRequestError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    isLoading={isRequestingCat}
                    onClick={handleRequestCategory}
                  >
                    Enviar Solicitud
                  </Button>
                </div>
              </div>
            )}

            {/* Notification of requested category */}
            {catRequestMessage && (
              <div className="rounded-xl border border-[#a8bca8] bg-[#a8bca8]/25 p-3 text-xs font-medium text-[#2e5e4e] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2e5e4e] shrink-0" />
                <span>{catRequestMessage}</span>
              </div>
            )}

            {/* Cloudinary Image Upload Section */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#373737] block">
                Imagen del Producto (Cloudinary) *
              </label>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />

              {/* Upload Dropzone / State */}
              {!imageUrl ? (
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
                    isUploading
                      ? "border-[#ca9029] bg-[#ca9029]/10 cursor-wait"
                      : "border-[#dfd2be] bg-white/70 hover:border-[#ca9029] hover:bg-[#f1e7d5]/30"
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center space-y-2 text-[#ca9029]">
                      <Loader2 className="h-10 w-10 animate-spin" />
                      <p className="font-bold text-sm">Subiendo imagen a Cloudinary...</p>
                      <p className="text-xs text-[#373737]/70">
                        Guardando en carpeta <strong>tienda-ayllu-productos</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className="h-12 w-12 rounded-2xl bg-[#ca9029]/15 text-[#ca9029] flex items-center justify-center">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-sm text-[#5d3805]">
                        Haz clic aquí para seleccionar una imagen desde tu dispositivo
                      </p>
                      <p className="text-xs text-[#373737]/65">
                        Archivos admitidos: JPG, PNG, WEBP, GIF (máximo 10 MB)
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Uploaded Image Preview */
                <div className="rounded-2xl border border-[#dfd2be] bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2e5e4e] bg-[#a8bca8]/25 px-2.5 py-1 rounded-lg border border-[#a8bca8]/60">
                      <CheckCircle2 className="h-4 w-4" />
                      Imagen guardada en Cloudinary (carpeta: tienda-ayllu-productos)
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Cambiar imagen
                    </button>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    <div className="relative h-28 w-28 rounded-xl overflow-hidden border border-[#dfd2be] bg-[#f1e7d5] shrink-0">
                      <img
                        src={imageUrl}
                        alt="Vista previa del producto"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#5d3805] mb-1">
                        URL segura (secure_url):
                      </p>
                      <p className="text-xs font-mono text-[#373737]/80 truncate bg-[#f1e7d5]/60 p-2 rounded-lg border border-[#dfd2be]">
                        {imageUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Error feedback */}
              {uploadError && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {uploadError}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-[#373737] block mb-1.5">
                Descripción detallada *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe los beneficios, especificaciones técnicas, materiales o instrucciones de tu producto..."
                className="w-full rounded-xl border border-[#dfd2be] bg-white p-3 text-sm text-[#373737] placeholder:text-[#373737]/45 focus:outline-none focus:ring-2 focus:ring-[#ca9029]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link href="/vendedor-panel/productos">
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isUploading}
            >
              Publicar en mi Tienda
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
