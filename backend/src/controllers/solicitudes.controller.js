import prisma from '../config/prisma.js';
import { calcularScore } from '../utils/scoring.util.js';
import { calcularCuotas } from '../utils/cronograma.util.js';

// @desc    Obtener todas las solicitudes (o filtradas por usuario)
// @route   GET /api/solicitudes
// @access  Private
export const getSolicitudes = async (req, res, next) => {
  try {
    const { emprendedor_id, estado } = req.query;
    const where = {};

    // Si es emprendedor, solo ver sus solicitudes
    if (req.user.rol.nombre === 'emprendedor') {
      where.emprendedorId = req.user.id;
    } else if (emprendedor_id) {
      where.emprendedorId = parseInt(emprendedor_id);
    }

    if (estado) {
      where.estado = estado;
    }

    const solicitudes = await prisma.solicitud.findMany({
      where,
      include: {
        emprendedor: {
          select: {
            id: true,
            nombre: true,
            correo: true,
            telefono: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
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

    let solicitud = await prisma.solicitud.create({
      data: {
        emprendedorId: req.user.id,
        estado: 'borrador',
        datosPersonales: datos_personales,
        datosNegocio: datos_negocio,
        datosSolicitud: datos_solicitud,
        documentos
      }
    });

    // Calcular score automático si tiene todos los datos
    if (datos_negocio && datos_solicitud) {
      const score = calcularScore({ datos_negocio, datos_solicitud });
      solicitud = await prisma.solicitud.update({
        where: { id: solicitud.id },
        data: { scoreAutomatico: score }
      });
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
    const solicitudId = parseInt(req.params.id);
    
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: solicitudId }
    });

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar permisos
    if (req.user.rol.nombre === 'emprendedor' && solicitud.emprendedorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para modificar esta solicitud'
      });
    }

    let solicitudActualizada = await prisma.solicitud.update({
      where: { id: solicitudId },
      data: req.body
    });

    // Recalcular score si se actualizaron datos relevantes
    if (req.body.datos_negocio || req.body.datos_solicitud) {
      const score = calcularScore(solicitudActualizada);
      solicitudActualizada = await prisma.solicitud.update({
        where: { id: solicitudId },
        data: { scoreAutomatico: score }
      });
    }

    res.json({
      success: true,
      message: 'Solicitud actualizada exitosamente',
      data: solicitudActualizada
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
    const solicitudId = parseInt(req.params.id);
    
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: solicitudId }
    });

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

    // Extraer datos de la solicitud (JSON field)
    const datosSolicitud = solicitud.datosSolicitud || {};
    const monto = datosSolicitud.monto || 0;
    const plazoMeses = datosSolicitud.plazoMeses || 12;

    if (!monto || monto <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La solicitud no tiene un monto válido'
      });
    }

    const tasaInteres = 12; // 12% anual

    // Generar cuotas
    const cuotasData = calcularCuotas(monto, plazoMeses, tasaInteres);

    // Crear cronograma con cuotas en una transacción
    const cronograma = await prisma.cronograma.create({
      data: {
        solicitudId: solicitud.id,
        tasaInteres: tasaInteres,
        montoTotal: monto,
        plazoMeses: plazoMeses,
        cuotas: {
          create: cuotasData
        }
      },
      include: {
        cuotas: true
      }
    });

    // Actualizar solicitud
    const solicitudActualizada = await prisma.solicitud.update({
      where: { id: solicitudId },
      data: {
        estado: 'aprobado'
      }
    });

    res.json({
      success: true,
      message: 'Solicitud aprobada y cronograma generado',
      data: {
        solicitud: solicitudActualizada,
        cronograma: {
          id: cronograma.id,
          totalCuotas: cronograma.cuotas.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export default { getSolicitudes, createSolicitud, updateSolicitud, aprobarSolicitud };
