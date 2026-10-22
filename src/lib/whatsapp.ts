import { cleanPhoneNumber, formatCurrency } from "./utils";
import { WhatsAppOrderPayload } from "@/types";

/**
 * Builds a dynamic WhatsApp checkout URL (https://wa.me/...) with product details,
 * quantity, total price, and the direct canonical URL of the product.
 */
export function buildWhatsAppOrderUrl(payload: WhatsAppOrderPayload): string {
  const {
    vendorWhatsapp,
    storeName,
    productTitle,
    productPrice,
    quantity,
    productUrl,
    customerNotes,
  } = payload;

  const phone = cleanPhoneNumber(vendorWhatsapp);
  const totalPrice = productPrice * quantity;
  const formattedUnitPrice = formatCurrency(productPrice);
  const formattedTotal = formatCurrency(totalPrice);

  const lines = [
    `¡Hola *${storeName}*! 👋`,
    `Me gustaría realizar un pedido del siguiente producto:`,
    ``,
    `🛍️ *Producto:* ${productTitle}`,
    `🔢 *Cantidad:* ${quantity}`,
    `💵 *Precio unitario:* ${formattedUnitPrice}`,
    `💰 *Total estimado:* ${formattedTotal}`,
    `🔗 *Ver producto:* ${productUrl}`,
  ];

  if (customerNotes && customerNotes.trim().length > 0) {
    lines.push(``, `📝 *Nota adicional:* ${customerNotes.trim()}`);
  }

  lines.push(``, `¿Tienen disponibilidad y cómo procedemos con el envío/pago? ¡Gracias!`);

  const message = lines.join("\n");
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Generates general store inquiry WhatsApp link
 */
export function buildWhatsAppStoreInquiryUrl(
  whatsappNumber: string,
  storeName: string
): string {
  const phone = cleanPhoneNumber(whatsappNumber);
  const message = `¡Hola *${storeName}*! 👋 Vi su tienda y me gustaría consultar información sobre sus productos.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
