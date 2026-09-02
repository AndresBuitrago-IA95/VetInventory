<<<<<<< HEAD
# VetInventory - Sistema de Gestión para Veterinarias

Aplicación web de inventario para veterinarias con autenticación, gestión de productos, ventas y reportes financieros.

## Características

- **Autenticación**: Sistema de login/registro con Firebase Authentication
- **Inventario**: Gestión completa de productos con alertas de stock mínimo
- **Ventas**: Carrito de compras con cálculo automático de impuestos
- **Reportes**: Dashboard con gráficos de ingresos y ventas
- **Responsive**: Diseño adaptable para móviles y escritorio

## Tecnologías

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Charts**: Recharts para visualización de datos
- **Estado**: Zustand para gestión de estado

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd InventarioVeterinarias
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura Firebase:
- Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
- Habilita Firebase Authentication (Email/Password)
- Habilita Firestore Database
- Copia las credenciales a `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## Deploy en Vercel

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Inicia sesión:
```bash
vercel login
```

3. Despliega:
```bash
vercel
```

4. Configura las variables de entorno en Vercel:
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── api/          # API routes
│   ├── dashboard/    # Página principal
│   ├── inventory/    # Gestión de inventario
│   ├── sales/        # Punto de venta
│   ├── reports/      # Reportes financieros
│   ├── login/        # Página de login
│   └── register/     # Página de registro
├── components/       # Componentes React
├── lib/             # Funciones de Firebase y store
└── types/           # Tipos TypeScript
```

## Licencia

MIT
=======
# VetInventory
>>>>>>> d08ec1fb81056f85851b9b2d5610cfe22793fd30
