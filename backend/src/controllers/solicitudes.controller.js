import models from '../models/index.js';
import { calcularScore } from '../utils/scoring.util.js';
import { calcularCuotas } from '../utils/cronograma.util.js';

const { Solicitud, Usuario, Cronograma, Cuota } = models;

// @desc    Obtener todas las solicitudes (o filtradas por usuario)
// @route   GET /api/solicitudes
// @access  Private
export const getSolicitudes = async (req, res, next) => {
  try {
    const { emprendedor_id, estado } = req.query;
    const where = {};

    // Si es emprendedor, solo ver sus solicitudes
    if (req.user.rol.nombre === 'emprendedor') {
      where.emprendedor_id = req.user.id;
    } else if (emprendedor_id) {
      where.emprendedor_id = emprendedor_id;
    }

    if (estado) {
      where.estado = estado;
    }

    const solicitudes = await Solicitud.findAll({
      where,
      include: [{
        model: Usuario,
        as: 'emprendedor',
        attributes: ['id', 'nombre', 'correo', 'telefono']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: solicitudes.length,
      data: solicitudes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear nueva solicitud
// @route   POST /api/solicitudes
// @access  Private (Emprendedor)
export const createSolicitud = async (req, res, next) => {
  try {
    const { datos_personales, datos_negocio, datos_solicitud, documentos } = req.body;

    const solicitud = await Solicitud.create({
      emprendedor_id: req.user.id,
      estado: 'borrador',
      datos_personales,
      datos_negocio,
      datos_solicitud,
      documentos
    });

    // Calcular score automático si tiene todos los datos
    if (datos_negocio && datos_solicitud) {
      const score = calcularScore({ datos_negocio, datos_solicitud });
      await solicitud.update({ score_automatico: score });
    }

    res.status(201).json({
      success: true,
      message: 'Solicitud creada exitosamente',
      data: solicitud
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar solicitud
// @route   PUT /api/solicitudes/:id
// @access  Private
export const updateSolicitud = async (req, res, next) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar permisos
    if (req.user.rol.nombre === 'emprendedor' && solicitud.emprendedor_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para modificar esta solicitud'
      });
    }

    await solicitud.update(req.body);

    // Recalcular score si se actualizaron datos relevantes
    if (req.body.datos_negocio || req.body.datos_solicitud) {
      const score = calcularScore(solicitud);
      await solicitud.update({ score_automatico: score });
    }

    res.json({
      success: true,
      message: 'Solicitud actualizada exitosamente',
      data: solicitud
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Aprobar solicitud y generar cronograma
// @route   POST /api/solicitudes/:id/aprobar
// @access  Private (Evaluador/Admin)
export const aprobarSolicitud = async (req, res, next) => {
  try {
    const solicitud = await Solicitud.findByPk(req.params.id);

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    if (solicitud.estado === 'aprobado') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya está aprobada'
      });
    }

    const { monto, plazoMeses } = solicitud.datos_solicitud;
    const tasaInteres = 12; // 12% anual

    // Crear cronograma
    const cronograma = await Cronograma.create({
      solicitud_id: solicitud.id,
      tasa_interes: tasaInteres,
      monto_total: monto,
      plazo_meses: plazoMeses
    });

    // Generar cuotas
    const cuotas = calcularCuotas(monto, plazoMeses, tasaInteres);
    
    for (const cuotaData of cuotas) {
      await Cuota.create({
        cronograma_id: cronograma.id,
        ...cuotaData
      });
    }

    // Actualizar solicitud
    await solicitud.update({
      estado: 'aprobado',
      cronograma_id: cronograma.id
    });

    res.json({
      success: true,
      message: 'Solicitud aprobada y cronograma generado',
      data: {
        solicitud,
        cronograma
      }
    });
  } catch (error) {
    next(error);
  }
};

export default { getSolicitudes, createSolicitud, updateSolicitud, aprobarSolicitud };
