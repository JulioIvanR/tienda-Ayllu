import { User, Vendor, Category, Product } from "@/types";

export const MOCK_USERS: User[] = [
  {
    id: "usr_admin_1",
    email: "admin@marketplace.com",
    name: "Administrador General",
    role: "SUPER_ADMIN",
    status: "APPROVED",
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-10"),
  },
  {
    id: "usr_vendor_1",
    email: "cafe@delvalle.com",
    name: "Carlos Restrepo",
    role: "VENDOR",
    status: "APPROVED",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
  {
    id: "usr_vendor_2",
    email: "tech@express.com",
    name: "Lucía Gómez",
    role: "VENDOR",
    status: "APPROVED",
    createdAt: new Date("2026-02-15"),
    updatedAt: new Date("2026-02-15"),
  },
  {
    id: "usr_vendor_3",
    email: "pedro@modaurbana.com",
    name: "Pedro Morales",
    role: "VENDOR",
    status: "PENDING",
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: "ven_cafe_1",
    userId: "usr_vendor_1",
    storeName: "Café Origen & Artesanías",
    slug: "cafe-origen",
    description:
      "Café de especialidad cultivado en altura, tostado artesanalmente y productos gourmet directo de pequeños productores.",
    logoUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop&crop=faces",
    bannerUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=350&fit=crop",
    whatsappNumber: "573001234567",
    email: "contacto@cafeorigen.com",
    phone: "+57 300 123 4567",
    address: "Calle 10 # 43D-24, El Poblado",
    city: "Medellín, Colombia",
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  },
  {
    id: "ven_tech_2",
    userId: "usr_vendor_2",
    storeName: "TechStore Pro",
    slug: "techstore-pro",
    description:
      "Accesorios para smartphones, cargadores rápidos, gadgets de audio y periféricos para oficina en casa.",
    logoUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&h=200&fit=crop&crop=faces",
    bannerUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=350&fit=crop",
    whatsappNumber: "573159876543",
    email: "ventas@techstorepro.com",
    phone: "+57 315 987 6543",
    address: "Cra 15 # 85-30, Chicó",
    city: "Bogotá, Colombia",
    createdAt: new Date("2026-02-15"),
    updatedAt: new Date("2026-02-15"),
  },
  {
    id: "ven_moda_3",
    userId: "usr_vendor_3",
    storeName: "Moda Urbana Studio",
    slug: "moda-urbana",
    description: "Prendas streetwear sostenibles con diseños exclusivos inspirados en arte contemporáneo.",
    logoUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&h=200&fit=crop&crop=faces",
    bannerUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=350&fit=crop",
    whatsappNumber: "573105557788",
    email: "pedro@modaurbana.com",
    phone: "+57 310 555 7788",
    address: "Av. Santander # 54-12",
    city: "Manizales, Colombia",
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat_cafe",
    name: "Café & Gourmet",
    slug: "cafe-gourmet",
    description: "Granos selectos, mieles y delicias artesanales",
    icon: "Coffee",
    status: "APPROVED",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "cat_tech",
    name: "Tecnología & Gadgets",
    slug: "tecnologia-gadgets",
    description: "Accesorios, audio y conectividad",
    icon: "Headphones",
    status: "APPROVED",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "cat_moda",
    name: "Ropa & Accesorios",
    slug: "ropa-accesorios",
    description: "Estilo urbano y prendas de autor",
    icon: "Shirt",
    status: "APPROVED",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  },
  {
    id: "cat_artesanias",
    name: "Artesanías & Hogar",
    slug: "artesanias-hogar",
    description: "Decoración y cerámica tradicional",
    icon: "Home",
    status: "PENDING",
    requestedById: "usr_vendor_1",
    createdAt: new Date("2026-03-02"),
    updatedAt: new Date("2026-03-02"),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod_cafe_geisha",
    title: "Café Especial Variedad Geisha 500g",
    slug: "cafe-especial-geisha-500g",
    description:
      "Café de especialidad con notas florales a jazmín, durazno y miel silvestre. Cosechado a 1.950 msnm con tueste medio para resaltar la dulzura natural.",
    price: 45000,
    stock: 24,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop",
    ],
    isActive: true,
    vendorId: "ven_cafe_1",
    categoryId: "cat_cafe",
    createdAt: new Date("2026-02-05"),
    updatedAt: new Date("2026-02-05"),
  },
  {
    id: "prod_prensa_francesa",
    title: "Prensa Francesa de Vidrio y Bambú 600ml",
    slug: "prensa-francesa-vidrio-bambu-600ml",
    description:
      "Cafetera prensa francesa elaborada con vidrio de borosilicato resistente a altas temperaturas y detalles en bambú natural. Filtro de acero inoxidable que no altera el sabor.",
    price: 68000,
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=800&fit=crop",
    ],
    isActive: true,
    vendorId: "ven_cafe_1",
    categoryId: "cat_cafe",
    createdAt: new Date("2026-02-08"),
    updatedAt: new Date("2026-02-08"),
  },
  {
    id: "prod_audifonos_anc",
    title: "Audífonos Inalámbricos Pro ANC",
    slug: "audifonos-inalambricos-pro-anc",
    description:
      "Cancelación activa de ruido híbrida, 36 horas de autonomía, carga ultrarrápida USB-C y sonido Hi-Res inalámbrico con graves profundos.",
    price: 189000,
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
    ],
    isActive: true,
    vendorId: "ven_tech_2",
    categoryId: "cat_tech",
    createdAt: new Date("2026-02-18"),
    updatedAt: new Date("2026-02-18"),
  },
  {
    id: "prod_cargador_gan",
    title: "Cargador Rápido GaN 65W Triple Puerto",
    slug: "cargador-rapido-gan-65w-triple-puerto",
    description:
      "Tecnología de nitruro de galio (GaN) compacta y eficiente. 2 puertos USB-C PD y 1 USB-A con soporte para laptops, tablets y smartphones.",
    price: 95000,
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&h=800&fit=crop",
    ],
    isActive: true,
    vendorId: "ven_tech_2",
    categoryId: "cat_tech",
    createdAt: new Date("2026-02-20"),
    updatedAt: new Date("2026-02-20"),
  },
  {
    id: "prod_hoodie_oversize",
    title: "Hoodie Oversize Algodón Orgánico 'Street Life'",
    slug: "hoodie-oversize-algodon-organico-street-life",
    description:
      "Buzo con capucha confeccionado en 100% algodón orgánico pesado (400 GSM). Calce relajado unisex con estampa serigráfica al agua en la espalda.",
    price: 120000,
    stock: 8,
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=800&fit=crop",
    ],
    isActive: true,
    vendorId: "ven_moda_3",
    categoryId: "cat_moda",
    createdAt: new Date("2026-03-02"),
    updatedAt: new Date("2026-03-02"),
  },
];

// Helper functions for retrieval
export function getMockVendorBySlug(slug: string): Vendor | undefined {
  return MOCK_VENDORS.find((v) => v.slug === slug);
}

export function getMockProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getMockProductsByVendor(vendorId: string): Product[] {
  return MOCK_PRODUCTS.filter((p) => p.vendorId === vendorId && p.isActive);
}
