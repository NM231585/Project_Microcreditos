import express from 'express';
import {
  getSolicitudes,
  createSolicitud,
  updateSolicitud,
  aprobarSolicitud
} from '../controllers/solicitudes.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.route('/')
  .get(getSolicitudes)
  .post(authorize('emprendedor'), createSolicitud);

router.route('/:id')
  .put(updateSolicitud);

router.post('/:id/aprobar', authorize('evaluador', 'admin'), aprobarSolicitud);

export default router;
