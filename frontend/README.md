# 🎨 Frontend - Microcréditos

Aplicación React para la plataforma de gestión de microcréditos.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

## 📋 Requisitos

- Node.js 18+
- Backend corriendo en puerto 5000

## 🛠️ Tecnologías

- **React 18.3.1** - Biblioteca UI
- **TypeScript 5.9.3** - Tipado estático
- **Vite 6.3.5** - Build tool
- **Tailwind CSS** - Framework de estilos
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos
- **Sonner** - Notificaciones

## 📁 Estructura

```
src/
├── components/
│   ├── ui/              # Componentes reutilizables
│   ├── auth/            # Login, Register
│   ├── dashboard/       # Dashboard emprendedor
│   ├── admin/           # Panel administrativo
│   ├── solicitud/       # Formulario de solicitud
│   └── cronograma/      # Vista de cronograma
├── services/
│   └── api.js           # Servicios API
├── context/
│   └── AuthContext.jsx  # Contexto de autenticación
├── hooks/
│   └── useAuth.js       # Hook de autenticación
├── App.tsx              # Componente principal
└── main.tsx             # Punto de entrada
```

## 📜 Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

## 🔗 Integración con Backend

El frontend se comunica con el backend en `http://localhost:5000/api`

### Endpoints Usados

- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `GET /api/solicitudes` - Listar solicitudes
- `POST /api/solicitudes` - Crear solicitud
- `POST /api/solicitudes/:id/aprobar` - Aprobar
- `GET /api/cronogramas/solicitud/:id` - Ver cronograma

## 🎨 Componentes Principales

### Autenticación

- `Login.tsx` - Formulario de login
- `Register.tsx` - Formulario de registro

### Dashboards

- `EmprendedorDashboard.tsx` - Dashboard para emprendedores
- `AdminPanel.tsx` - Panel para evaluadores

### Formularios

- `SolicitudForm.tsx` - Formulario de solicitud de microcrédito

### Visualización

- `CronogramaView.tsx` - Vista de cronograma de pagos
- `Landing.tsx` - Página de inicio

## 🔐 Autenticación

El frontend usa JWT almacenado en `localStorage`:

```javascript
// Login
const { login } = useAuth();
await login(correo, password);

// Logout
const { logout } = useAuth();
logout();

// Usuario actual
const { user, isAuthenticated } = useAuth();
```

## 🎯 Características

- ✅ Autenticación con JWT
- ✅ Rutas protegidas
- ✅ Estados de carga
- ✅ Manejo de errores
- ✅ Notificaciones toast
- ✅ Diseño responsive
- ✅ Tema moderno con Tailwind

## 🐛 Solución de Problemas

### Error: Cannot connect to backend

- Verifica que el backend esté corriendo en puerto 5000
- Revisa la configuración de CORS en el backend

### Error: Module not found

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notas

- El frontend está configurado para conectarse a `http://localhost:5000`
- CORS está habilitado en el backend para `http://localhost:3000`
- Los tokens JWT expiran en 7 días
