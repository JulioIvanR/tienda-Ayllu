import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Hash de contraseña
  const passwordHash = await bcrypt.hash("Aguila&Condor2026", 10);

  // 1. Crear Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@comunidadilumina.com" },
    update: {},
    create: {
      email: "admin@comunidadilumina.com",
      name: "nousadmin",
      passwordHash: passwordHash,
      role: "SUPER_ADMIN",
      status: "APPROVED",
    },
  });

  console.log("✅ Super Admin creado:", superAdmin.email);

  // 2. Crear Vendor User
  const vendorUser = await prisma.user.upsert({
    where: { email: "info@comunidadilumina.com" },
    update: {},
    create: {
      email: "info@comunidadilumina.com",
      name: "tienda",
      passwordHash: passwordHash,
      role: "VENDOR",
      status: "APPROVED",
    },
  });

  console.log("✅ Vendor creado:", vendorUser.email);

  // 3. Crear Vendor Profile
  const vendorProfile = await prisma.vendor.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      storeName: "Comunidad ILUMINA",
      slug: "comunidad-ilumina",
      description:
        "Tienda oficial de la Comunidad ILUMINA - Productos y servicios del despertar",
      whatsappNumber: "573001234567",
      email: "info@comunidadilumina.com",
      phone: "+57 300 123 4567",
      address: "Calle Principal 123",
      city: "Bogotá",
    },
  });

  console.log("✅ Perfil de Vendor creado:", vendorProfile.storeName);

  // 4. Crear Categorías
  const catCafe = await prisma.category.upsert({
    where: { slug: "cafe-gourmet" },
    update: {},
    create: {
      name: "Café & Gourmet",
      slug: "cafe-gourmet",
      description: "Granos selectos, mieles y delicias artesanales",
      icon: "Coffee",
      status: "APPROVED",
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
      status: "APPROVED",
    },
  });

  console.log("✅ Categorías creadas");

  // 5. Crear Productos
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
      vendorId: vendorProfile.id,
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
      vendorId: vendorProfile.id,
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
      vendorId: vendorProfile.id,
      categoryId: catTech.id,
    },
  });

  console.log("✅ Productos creados");

  console.log("🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
