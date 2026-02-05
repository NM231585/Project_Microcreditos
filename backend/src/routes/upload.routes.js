import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/upload - Subir archivos
router.post('/', protect, upload.array('files', 5), (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se recibieron archivos'
      });
    }

    // Mapear información de archivos subidos
    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: `/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      message: `${files.length} archivo(s) subido(s) exitosamente`,
      files
    });
  } catch (error) {
    next(error);
  }
});

export default router;
