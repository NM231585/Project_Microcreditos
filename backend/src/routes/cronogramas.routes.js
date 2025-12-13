import express from 'express';
import {
  getCronograma,
  getCronogramaBySolicitud,
  marcarCuotaPagada
} from '../controllers/cronogramas.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.get('/:id', getCronograma);
router.get('/solicitud/:solicitudId', getCronogramaBySolicitud);
router.patch('/:id/cuotas/:cuotaId/pagar', authorize('evaluador', 'admin'), marcarCuotaPagada);

export default router;
