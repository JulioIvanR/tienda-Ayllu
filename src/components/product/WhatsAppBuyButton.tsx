"use client";

import { useState, useMemo } from "react";
import { MessageCircle, Plus, Minus, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { Product, Vendor } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

interface WhatsAppBuyButtonProps {
  product: Product;
  vendor: Vendor;
}

export function WhatsAppBuyButton({ product, vendor }: WhatsAppBuyButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const maxStock = product.stock > 0 ? product.stock : 1;
  const isOutOfStock = product.stock === 0;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Build the live canonical URL from window location if on client
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_APP_URL || "https://tienda.com"}/producto/${product.slug}`;

  // Live WhatsApp checkout URL
  const whatsAppUrl = useMemo(() => {
    return buildWhatsAppOrderUrl({
      vendorWhatsapp: vendor.whatsappNumber,
      storeName: vendor.storeName,
      productTitle: product.title,
      productPrice: Number(product.price),
      quantity: quantity,
      productUrl: currentUrl,
      customerNotes: notes,
    });
  }, [vendor, product, quantity, currentUrl, notes]);

  const totalPrice = Number(product.price) * quantity;

  return (
    <div className="rounded-3xl border border-emerald-200/90 bg-emerald-50/40 p-6 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/20">
      <div className="space-y-5">
        {/* Quantity and Subtotal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60 dark:border-emerald-900/40">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Cantidad
            </label>
            <div className="inline-flex items-center rounded-xl border border-slate-300 bg-white p-1 shadow-xs dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isOutOfStock}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Disminuir cantidad"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-bold text-slate-900 dark:text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= maxStock || isOutOfStock}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {product.stock > 0 && (
              <span className="block mt-1 text-xs text-slate-500">
                {product.stock} unidades disponibles
              </span>
            )}
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Total estimado
            </span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {formatCurrency(totalPrice)}
            </span>
            <span className="block text-xs text-slate-500">
              ({quantity} x {formatCurrency(Number(product.price))})
            </span>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
            Nota o especificación para el vendedor (opcional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Talla M, entrega en horario de la tarde, etc."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Action Button: Redirection to WhatsApp */}
        <div className="space-y-3">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 px-6 text-center text-base font-bold text-white shadow-md transition-all duration-200 ${
              isOutOfStock
                ? "bg-slate-400 cursor-not-allowed pointer-events-none"
                : "bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.99]"
            }`}
          >
            <MessageCircle className="h-5 w-5 fill-white text-emerald-600" />
            <span>Pedir por WhatsApp al instante</span>
            <Send className="h-4 w-4 ml-1" />
          </a>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 inline" />
            <span>Contacto directo con {vendor.storeName} (+{vendor.whatsappNumber})</span>
          </p>
        </div>

        {/* WhatsApp Message Preview Accordion */}
        <div className="rounded-xl border border-slate-200 bg-white/70 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Mensaje preformateado que se enviará:
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-2.5 font-mono text-[11px] leading-relaxed border border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
            {`¡Hola *${vendor.storeName}*! 👋
Me gustaría realizar un pedido del siguiente producto:

🛍️ *Producto:* ${product.title}
🔢 *Cantidad:* ${quantity}
💵 *Precio unitario:* ${formatCurrency(Number(product.price))}
💰 *Total estimado:* ${formatCurrency(totalPrice)}
🔗 *Ver producto:* ${currentUrl}${notes ? `\n\n📝 *Nota:* ${notes}` : ""}`}
          </div>
        </div>
      </div>
    </div>
  );
}
