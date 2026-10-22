import { PrismaClient, Role, ApprovalStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Super Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@marketplace.com" },
    update: {},
    create: {
      email: "admin@marketplace.com",
      name: "Administrador General",
      role: Role.SUPER_ADMIN,
      status: ApprovalStatus.APPROVED,
    },
  });
  console.log(`✅ Admin created/verified: ${admin.email}`);

  // 2. Vendor Users
  const vendorUser1 = await prisma.user.upsert({
    where: { email: "cafe@delvalle.com" },
    update: {},
    create: {
      email: "cafe@delvalle.com",
      name: "Carlos Restrepo",
      role: Role.VENDOR,
      status: ApprovalStatus.APPROVED,
    },
  });

  const vendorUser2 = await prisma.user.upsert({
    where: { email: "tech@express.com" },
    update: {},
    create: {
      email: "tech@express.com",
      name: "Lucía Gómez",
      role: Role.VENDOR,
      status: ApprovalStatus.APPROVED,
    },
  });

  // 3. Vendors Profile
  const vendor1 = await prisma.vendor.upsert({
    where: { slug: "cafe-origen" },
    update: {},
    create: {
      userId: vendorUser1.id,
      storeName: "Café Origen & Artesanías",
      slug: "cafe-origen",
      description:
        "Café de especialidad cultivado en altura, tostado artesanalmente y productos gourmet directo de pequeños productores.",
      logoUrl:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop&crop=faces",
      bannerUrl:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=350&fit=crop",
      whatsappNumber: "573001234567",
      email: "contacto@cafeorigen.com",
      phone: "+57 300 123 4567",
      address: "Calle 10 # 43D-24, El Poblado",
      city: "Medellín, Colombia",
    },
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { slug: "techstore-pro" },
    update: {},
    create: {
      userId: vendorUser2.id,
      storeName: "TechStore Pro",
      slug: "techstore-pro",
      description:
        "Accesorios para smartphones, cargadores rápidos, gadgets de audio y periféricos para oficina en casa.",
      logoUrl:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&h=200&fit=crop&crop=faces",
      bannerUrl:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=350&fit=crop",
      whatsappNumber: "573159876543",
      email: "ventas@techstorepro.com",
      phone: "+57 315 987 6543",
      address: "Cra 15 # 85-30, Chicó",
      city: "Bogotá, Colombia",
    },
  });

  // 4. Categories
  const catCafe = await prisma.category.upsert({
    where: { slug: "cafe-gourmet" },
    update: {},
    create: {
      name: "Café & Gourmet",
      slug: "cafe-gourmet",
      description: "Granos selectos, mieles y delicias artesanales",
      icon: "Coffee",
      status: ApprovalStatus.APPROVED,
    },
  });

  const catTech = await prisma.category.upsert({
    where: { slug: "tecnologia-gadgets" },
    update: {},
    create: {
      name: "Tecnología & Gadgets",
      slug: "tecnologia-gadgets",
      description: "Accesorios, audio y conectividad",
      icon: "Headphones",
      status: ApprovalStatus.APPROVED,
    },
  });

  // 5. Products
  await prisma.product.upsert({
    where: { slug: "cafe-especial-geisha-500g" },
    update: {},
    create: {
      title: "Café Especial Variedad Geisha 500g",
      slug: "cafe-especial-geisha-500g",
      description:
        "Café de especialidad con notas florales a jazmín, durazno y miel silvestre. Cosechado a 1.950 msnm con tueste medio para resaltar la dulzura natural.",
      price: 45000,
      stock: 24,
      images: [
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=800&fit=crop",
      ],
      isActive: true,
      vendorId: vendor1.id,
      categoryId: catCafe.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "prensa-francesa-vidrio-bambu-600ml" },
    update: {},
    create: {
      title: "Prensa Francesa de Vidrio y Bambú 600ml",
      slug: "prensa-francesa-vidrio-bambu-600ml",
      description:
        "Cafetera prensa francesa elaborada con vidrio de borosilicato resistente a altas temperaturas y detalles en bambú natural. Filtro de acero inoxidable que no altera el sabor.",
      price: 68000,
      stock: 12,
      images: [
        "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&h=800&fit=crop",
      ],
      isActive: true,
      vendorId: vendor1.id,
      categoryId: catCafe.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "audifonos-inalambricos-pro-anc" },
    update: {},
    create: {
      title: "Audífonos Inalámbricos Pro ANC",
      slug: "audifonos-inalambricos-pro-anc",
      description:
        "Cancelación activa de ruido híbrida, 36 horas de autonomía, carga ultrarrápida USB-C y sonido Hi-Res inalámbrico con graves profundos.",
      price: 189000,
      stock: 15,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      ],
      isActive: true,
      vendorId: vendor2.id,
      categoryId: catTech.id,
    },
  });

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
