# 💰 Microcréditos - Plataforma Web

Plataforma completa para la gestión de microcréditos dirigida a emprendedores rurales, con frontend React y backend Node.js.

## 📁 Estructura del Proyecto

```
Microcreditos/
├── frontend/                    # Aplicación React (Puerto 3000)
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas de la aplicación
│   │   ├── services/           # Servicios API
│   │   ├── context/            # Context API (Auth)
│   │   └── lib/                # Utilidades
│   ├── public/
│   └── package.json
├── backend/                     # API REST Node.js (Puerto 5000)
│   ├── prisma/
│   │   ├── schema.prisma       # Esquema de base de datos
│   │   └── seed.js             # Datos iniciales
│   ├── src/
│   │   ├── config/             # Configuración (Prisma)
│   │   ├── controllers/        # Lógica de negocio
│   │   ├── routes/             # Rutas de la API
│   │   ├── middlewares/        # Auth, roles, errores
│   │   ├── utils/              # Utilidades (scoring, cuotas)
│   │   └── server.js           # Servidor principal
│   ├── database/
│   │   └── init.sql            # Script SQL (opcional)
│   └── package.json
└── README.md                    # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- XAMPP (MySQL)
- npm o yarn

### 1. Configurar Backend

```bash
# Iniciar XAMPP y MySQL
# Abrir phpMyAdmin: http://localhost/phpmyadmin

# Crear base de datos
cd backend
# Ejecutar script SQL: backend/database/init.sql en phpMyAdmin

# Instalar dependencias
npm install

# Iniciar servidor backend
npm run dev
# ✅ Backend corriendo en http://localhost:5000
```

### 2. Configurar Frontend

```bash
# En otra terminal
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
# ✅ Frontend corriendo en http://localhost:3000
```

### 3. Poblar Base de Datos (Opcional)

```bash
cd backend
npx prisma db seed
# ✅ Crea usuarios de prueba
```

### 4. Abrir en el navegador

```
http://localhost:3000
```

## 👥 Usuarios de Prueba

El sistema incluye 3 usuarios de prueba pre-configurados:

### 🌾 Emprendedor

```
📧 Correo: emprendedor@test.com
🔑 Password: test123
👤 Nombre: María González
📍 Ubicación: Warnes, Santa Cruz
```

**Funciones:** Crear solicitudes, ver cronogramas de pago

### 📋 Evaluador

```
📧 Correo: evaluador@test.com
🔑 Password: test123
👤 Nombre: Carlos Méndez
```

**Funciones:** Revisar y aprobar solicitudes, generar cronogramas

### ⚙️ Administrador

```
📧 Correo: admin@test.com
🔑 Password: test123
👤 Nombre: Admin Sistema
```

**Funciones:** Acceso completo al sistema

> **Nota:** Ejecuta `npx prisma db seed` en la carpeta backend para crear estos usuarios.

## 🔐 Gestión de Usuarios

### Registro Público

El formulario de registro público **solo permite crear Emprendedores**. Esto es por diseño de seguridad.

### Crear Evaluadores y Administradores

Los usuarios con roles de Evaluador y Administrador deben crearse manualmente. Hay dos métodos:

#### Método 1: Usando el Script de Seed (Recomendado)

1. **Edita** `backend/prisma/seed.js`
2. **Agrega nuevos usuarios** siguiendo este patrón:

```javascript
// Nuevo Evaluador
await prisma.usuario.create({
  data: {
    nombre: "Juan Pérez",
    correo: "juan.evaluador@empresa.com",
    telefono: "555-0002",
    password: await bcrypt.hash("password123", 10),
    departamento: "Guatemala",
    municipio: "Guatemala",
    rolId: rolEvaluador.id,
  },
});

// Nuevo Administrador
await prisma.usuario.create({
  data: {
    nombre: "María López",
    correo: "maria.admin@empresa.com",
    telefono: "555-0003",
    password: await bcrypt.hash("admin123", 10),
    departamento: "Guatemala",
    municipio: "Guatemala",
    rolId: rolAdministrador.id,
  },
});
```

3. **Ejecuta el seed:**

```bash
cd backend
node prisma/seed.js
```

#### Método 2: Directamente en MySQL (phpMyAdmin)

1. Abre **phpMyAdmin** desde XAMPP
2. Selecciona la base de datos `microcreditos_db`
3. Ve a la tabla `Usuario`
4. Inserta un nuevo registro con:
   - `rolId`: `2` (Evaluador) o `3` (Administrador)
   - `password`: Hash bcrypt (genera uno en [bcrypt-generator.com](https://bcrypt-generator.com/))

> ⚠️ **Importante:** Por seguridad, los roles de Evaluador y Administrador NO están disponibles en el registro público.

## 📚 Documentación Detallada

- **Frontend:** Ver [frontend/README.md](frontend/README.md)
- **Backend:** Ver [backend/README.md](backend/README.md)

## 🏗️ Arquitectura

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   Frontend      │ ◄─────► │     Backend      │ ◄─────► │    MySQL     │
│   React + Vite  │  HTTP   │  Express + JWT   │  SQL    │    XAMPP     │
│   Puerto 3000   │ Request │   Puerto 5000    │ Queries │  Puerto 3306 │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

## 🎯 Características

### Para Emprendedores

- ✅ Registro y autenticación
- ✅ Solicitud de microcréditos
- ✅ Dashboard con estado de solicitudes
- ✅ Visualización de cronogramas de pago

### Para Evaluadores

- ✅ Panel administrativo
- ✅ Revisión de solicitudes
- ✅ Sistema de scoring automático
- ✅ Aprobación y generación de cronogramas
- ✅ Seguimiento de pagos

## 🛠️ Tecnologías

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI

### Backend

- Node.js
- Express
- Prisma ORM
- MySQL
- JWT Authentication
- Bcrypt

## 📝 Scripts Disponibles

### Frontend

```bash
cd frontend
npm run dev      # Desarrollo
npm run build    # Producción
npm run preview  # Preview del build
```

### Backend

```bash
cd backend
npm run dev      # Desarrollo con nodemon
npm start        # Producción
```

## 🔐 Seguridad

- ✅ Passwords hasheados con bcrypt
- ✅ Autenticación JWT
- ✅ CORS configurado
- ✅ Validación de datos
- ✅ Protección de rutas por roles

## 📄 Licencia

Este proyecto es **privado y propietario**. Desarrollado como proyecto educativo.

**Todos los derechos reservados © 2025-2026**

> Este código no está disponible para uso, modificación o distribución sin autorización expresa de los autores.

## 👥 Autor

- **Michael Noyola**
- **Emilio Ruiz**

---

**Nota:** Asegúrate de tener XAMPP corriendo con MySQL antes de iniciar el backend.
