import { cleanPhoneNumber, formatCurrency } from "./utils";
import { WhatsAppOrderPayload } from "@/types";

/**
 * Builds the formatted WhatsApp order message body.
 */
export function buildWhatsAppOrderMessage(
  payload: Omit<WhatsAppOrderPayload, "vendorWhatsapp">
): string {
  const {
    storeName,
    productTitle,
    productPrice,
    quantity,
    productUrl,
    customerNotes,
  } = payload;

  const totalPrice = productPrice * quantity;
  const formattedUnitPrice = formatCurrency(productPrice);
  const formattedTotal = formatCurrency(totalPrice);

  const lines = [
    `¡Hola *${storeName}*! 👋`,
    `Vengo de Tienda AYLLU y me gustaría realizar un pedido del siguiente producto:`,
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

  lines.push(
    ``,
    `¿Tienen disponibilidad y cómo procedemos con el envío/pago? ¡Gracias!`
  );

  return lines.join("\n");
}

/**
 * Builds a dynamic WhatsApp checkout URL (https://wa.me/...) with product details,
 * quantity, total price, and the direct canonical URL of the product.
 */
export function buildWhatsAppOrderUrl(payload: WhatsAppOrderPayload): string {
  const phone = cleanPhoneNumber(payload.vendorWhatsapp);
  const message = buildWhatsAppOrderMessage(payload);
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
  const message = `¡Hola *${storeName}*! 👋 Vengo de Tienda AYLLU y me gustaría consultar información sobre sus productos.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
