"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { MessageCircle, Plus, Minus, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { Product, Vendor } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
} from "@/lib/whatsapp";

interface WhatsAppBuyButtonProps {
  product: Product;
  vendor: Vendor;
  baseOrigin?: string;
}

const emptySubscribe = () => () => {};

export function WhatsAppBuyButton({
  product,
  vendor,
  baseOrigin,
}: WhatsAppBuyButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const fallbackOrigin = (
    baseOrigin ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");

  const origin = useSyncExternalStore(
    emptySubscribe,
    () => window.location.origin,
    () => fallbackOrigin
  );

  const productUrl = `${origin.replace(/\/+$/, "")}/producto/${product.slug}`;

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

  const orderPayload = useMemo(
    () => ({
      vendorWhatsapp: vendor.whatsappNumber,
      storeName: vendor.storeName,
      productTitle: product.title,
      productPrice: Number(product.price),
      quantity,
      productUrl,
      customerNotes: notes,
    }),
    [vendor.whatsappNumber, vendor.storeName, product.title, product.price, quantity, productUrl, notes]
  );

  const whatsAppUrl = useMemo(
    () => buildWhatsAppOrderUrl(orderPayload),
    [orderPayload]
  );

  const messagePreview = useMemo(
    () => buildWhatsAppOrderMessage(orderPayload),
    [orderPayload]
  );

  const totalPrice = Number(product.price) * quantity;

  return (
    <div className="rounded-3xl border border-[#dfd2be] bg-[#fdfbf6] p-6 shadow-sm">
      <div className="space-y-5">
        {/* Quantity and Subtotal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#dfd2be]">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5d3805] block mb-2">
              Cantidad
            </label>
            <div className="inline-flex items-center rounded-xl border border-[#dfd2be] bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isOutOfStock}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-[#373737] hover:bg-[#f1e7d5] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Disminuir cantidad"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-bold text-[#5d3805]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= maxStock || isOutOfStock}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-[#373737] hover:bg-[#f1e7d5] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {product.stock > 0 && (
              <span className="block mt-1 text-xs text-[#373737]/70">
                {product.stock} unidades disponibles
              </span>
            )}
          </div>

          <div className="sm:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5d3805] block">
              Total estimado
            </span>
            <span className="text-2xl font-black text-[#ca9029]">
              {formatCurrency(totalPrice)}
            </span>
            <span className="block text-xs text-[#373737]/70">
              ({quantity} x {formatCurrency(Number(product.price))})
            </span>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="text-xs font-bold text-[#373737] block mb-1.5">
            Nota o especificación para el vendedor (opcional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Talla M, entrega en horario de la tarde, etc."
            className="w-full rounded-xl border border-[#dfd2be] bg-white px-3.5 py-2 text-sm text-[#373737] placeholder:text-[#373737]/45 focus:outline-none focus:ring-2 focus:ring-[#ca9029]"
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
                ? "bg-stone-400 cursor-not-allowed pointer-events-none"
                : "bg-[#25D366] hover:bg-[#20bd5a] hover:shadow-lg hover:shadow-emerald-600/25 active:scale-[0.99]"
            }`}
          >
            <MessageCircle className="h-5 w-5 fill-white text-white" />
            <span>Pedir por WhatsApp al instante</span>
            <Send className="h-4 w-4 ml-1" />
          </a>

          <p className="text-center text-xs text-[#373737]/80 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#2e5e4e] inline" />
            <span>Contacto directo con <strong>{vendor.storeName}</strong> (+{vendor.whatsappNumber})</span>
          </p>
        </div>

        {/* WhatsApp Message Preview Accordion */}
        <div className="rounded-xl border border-[#dfd2be] bg-[#f1e7d5]/60 p-3.5 text-xs text-[#373737]">
          <p className="font-bold text-[#5d3805] mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#2e5e4e]" />
            Mensaje preformateado que se enviará:
          </p>
          <div className="bg-white/90 rounded-lg p-2.5 font-mono text-[11px] leading-relaxed border border-[#dfd2be] whitespace-pre-wrap text-[#373737]">
            {messagePreview}
          </div>
        </div>
      </div>
    </div>
  );
}
