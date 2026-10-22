export type Role = "SUPER_ADMIN" | "VENDOR";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  status: ApprovalStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  vendor?: Vendor | null;
}

export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  whatsappNumber: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
  products?: Product[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon?: string | null;
  status: ApprovalStatus;
  requestedById?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  products?: Product[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  vendorId: string;
  vendor?: Vendor;
  categoryId: string;
  category?: Category;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface WhatsAppOrderPayload {
  vendorWhatsapp: string;
  storeName: string;
  productTitle: string;
  productPrice: number;
  quantity: number;
  productUrl: string;
  customerNotes?: string;
}
