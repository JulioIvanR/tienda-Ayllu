# 🛒 Vendly — Tienda Multivendedor con Redirección a WhatsApp

Plataforma Fullstack de comercio electrónico multivendedor construida con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons** y **Prisma ORM (PostgreSQL)**, diseñada para canalizar pedidos y conversiones directamente a **WhatsApp (`wa.me`)** sin comisiones ni fricciones.

---

## 🚀 Inicio Rápido

### 1. Iniciar el servidor de desarrollo
El proyecto incluye un conjunto completo de datos mock de demostración, por lo que **puedes levantarlo y probar todas las rutas y la redirección a WhatsApp de inmediato**:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗄️ Base de Datos y Prisma ORM (PostgreSQL)

El esquema de base de datos se encuentra definido en [`prisma/schema.prisma`](prisma/schema.prisma) con soporte para:

- **`User`**: Roles `SUPER_ADMIN` y `VENDOR`, con estados de aprobación (`PENDING`, `APPROVED`, `REJECTED`).
- **`Vendor`**: Perfil de tienda con `slug` único, número de WhatsApp para pedidos, banner, logotipo, ciudad y contacto.
- **`Category`**: Categorías globales del marketplace creadas por administradores o solicitadas por vendedores.
- **`Product`**: Productos con precio, stock, descripción, imágenes y relaciones con `Vendor` y `Category`.

### Variables de Entorno (`.env`)
Configura tu cadena de conexión a PostgreSQL en el archivo [`.env`](.env):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/tienda_multivendedor?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Comandos de Base de Datos
- Sincronizar el esquema con tu PostgreSQL:
  ```bash
  npx prisma db push
  ```
- Poblar la base de datos con datos iniciales (Seed):
  ```bash
  npm run seed
  ```
- Abrir la interfaz visual de Prisma Studio:
  ```bash
  npx prisma studio
  ```

---

## 🧭 Rutas y Funcionalidades Principales

| Ruta | Descripción |
| :--- | :--- |
| **`/`** | **Marketplace Principal**: Showcase de tiendas destacadas, categorías y catálogo de productos. |
| **`/vendedor/[slug]`** | **Mini-tienda Pública**: Banner, logotipo, información de contacto, buscador y filtros por categoría. Ej: `/vendedor/cafe-origen`. |
| **`/producto/[slug]`** | **Detalle del Producto**: Galería de imágenes, selector de cantidad interactivo, subtotal en tiempo real y **Botón dinámico de compra a WhatsApp**. Ej: `/producto/cafe-especial-geisha-500g`. |
| **`/vendedor-panel`** | **Panel de Vendedor**: Métricas de catálogo, stock total y enlace directo a su mini-tienda. |
| **`/vendedor-panel/productos`** | Gestión de productos (activos/pausados, eliminar, editar). |
| **`/vendedor-panel/productos/nuevo`** | Formulario para publicar nuevos productos con slug automático. |
| **`/vendedor-panel/perfil`** | Configuración de marca y número de WhatsApp receptor de pedidos. |
| **`/admin`** | **Panel de Super Admin**: Métricas globales y solicitudes pendientes. |
| **`/admin/usuarios`** | Aprobación y rechazo de vendedores. |
| **`/admin/categorias`** | Aprobación de categorías solicitadas y creación de categorías globales. |

---

## 💬 Mecanismo de Redirección a WhatsApp

Ubicado en [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts), genera dinámicamente enlaces codificados `https://wa.me/{telefono}?text={mensaje}` con la siguiente estructura:

```text
¡Hola Café Origen & Artesanías! 👋
Me gustaría realizar un pedido del siguiente producto:

🛍️ Producto: Café Especial Variedad Geisha 500g
🔢 Cantidad: 2
💵 Precio unitario: $ 45.000
💰 Total estimado: $ 90.000
🔗 Ver producto: http://localhost:3000/producto/cafe-especial-geisha-500g

📝 Nota adicional: Por favor en grano entero para prensa francesa.

¿Tienen disponibilidad y cómo procedemos con el envío/pago? ¡Gracias!
```

---

## 📁 Estructura del Proyecto

```text
tienda-multivendedor/
├── prisma/
│   ├── schema.prisma            # Modelos: User, Vendor, Category, Product, Enums
│   └── seed.ts                  # Script de población de datos iniciales
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx         # Portada del Marketplace
│   │   │   ├── vendedor/
│   │   │   │   └── [slug]/      # Mini-tienda pública dinámica
│   │   │   └── producto/
│   │   │       └── [slug]/      # Detalle de producto con botón a WhatsApp
│   │   ├── admin/               # Panel Super Admin (usuarios y categorías)
│   │   ├── vendedor-panel/      # Panel de Vendedor (productos y perfil)
│   │   ├── globals.css          # Tailwind CSS v4
│   │   └── layout.tsx           # Layout general con Navbar y Footer
│   ├── components/
│   │   ├── admin/               # Tablas de aprobación y acciones
│   │   ├── navigation/          # Navbar, Footer, Sidebars
│   │   ├── product/             # WhatsAppBuyButton, ProductCard, Gallery
│   │   ├── ui/                  # Button, Badge, Card, Input
│   │   └── vendor/              # VendorHeader, StoreCatalog
│   ├── lib/
│   │   ├── mock-data.ts         # Datos de demostración listos para usar
│   │   ├── prisma.ts            # Cliente singleton de Prisma
│   │   ├── utils.ts             # Formateo de moneda, slugs y clases
│   │   └── whatsapp.ts          # Generador de enlaces wa.me
│   └── types/
│       └── index.ts             # Interfaces TypeScript del dominio
├── .env.example
├── next.config.ts
├── package.json
└── tsconfig.json
```
