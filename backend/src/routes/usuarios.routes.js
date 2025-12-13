import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

// Placeholder - implementar según necesidad
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Ruta de usuarios' });
});

export default router;
