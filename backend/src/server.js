import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './config/prisma.js';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import solicitudesRoutes from './routes/solicitudes.routes.js';
import cronogramasRoutes from './routes/cronogramas.routes.js';
import uploadRoutes from './routes/upload.routes.js';

// Importar middleware de errores
import { errorHandler } from './middlewares/error.middleware.js';

// Para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir archivos estáticos desde uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'API de Microcréditos',
    version: '1.0.0',
    orm: 'Prisma',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      solicitudes: '/api/solicitudes',
      cronogramas: '/api/cronogramas'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/cronogramas', cronogramasRoutes);
app.use('/api/upload', uploadRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Conectar a la base de datos y iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos con Prisma
    await prisma.$connect();
    console.log('✅ Conexión a MySQL establecida correctamente con Prisma');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📝 Modo: ${process.env.NODE_ENV}`);
      console.log(`🔷 ORM: Prisma`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

startServer();

export default app;
