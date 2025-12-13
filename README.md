# 💰 Microcréditos - Plataforma Web

Plataforma completa para la gestión de microcréditos dirigida a emprendedores rurales, con frontend React y backend Node.js.

## 📁 Estructura del Proyecto

```
Microcreditos/
├── frontend/          # Aplicación React (Puerto 3000)
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # API REST Node.js (Puerto 5000)
│   ├── src/
│   ├── database/
│   └── package.json
└── README.md          # Este archivo
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

### 3. Abrir en el navegador

```
http://localhost:3000
```

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
- Sequelize ORM
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

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y está en desarrollo.

## 👥 Autor

- **Michael Noyola**
- **Emilio Ruiz**
---

**Nota:** Asegúrate de tener XAMPP corriendo con MySQL antes de iniciar el backend.
