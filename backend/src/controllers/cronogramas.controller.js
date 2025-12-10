import prisma from '../config/prisma.js';

// @desc    Obtener cronograma por ID
// @route   GET /api/cronogramas/:id
// @access  Private
export const getCronograma = async (req, res, next) => {
  try {
    const cronogramaId = parseInt(req.params.id);
    
    const cronograma = await prisma.cronograma.findUnique({
      where: { id: cronogramaId },
      include: {
        cuotas: {
          orderBy: {
            numero: 'asc'
          }
        },
        solicitud: true
      }
    });

    if (!cronograma) {
      return res.status(404).json({
        success: false,
        message: 'Cronograma no encontrado'
      });
    }

    res.json({
      success: true,
      data: cronograma
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener cronograma por solicitud ID
// @route   GET /api/cronogramas/solicitud/:solicitudId
// @access  Private
export const getCronogramaBySolicitud = async (req, res, next) => {
  try {
    const solicitudId = parseInt(req.params.solicitudId);
    
    const cronograma = await prisma.cronograma.findUnique({
      where: { solicitudId },
      include: {
        cuotas: {
          orderBy: {
            numero: 'asc'
          }
        }
      }
    });

    if (!cronograma) {
      return res.status(404).json({
        success: false,
        message: 'Cronograma no encontrado para esta solicitud'
      });
    }

    res.json({
      success: true,
      data: cronograma
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Marcar cuota como pagada
// @route   PATCH /api/cronogramas/:id/cuotas/:cuotaId/pagar
// @access  Private (Evaluador/Admin)
export const marcarCuotaPagada = async (req, res, next) => {
  try {
    const cuotaId = parseInt(req.params.cuotaId);
    const cronogramaId = parseInt(req.params.id);
    
    const cuota = await prisma.cuota.findFirst({
      where: {
        id: cuotaId,
        cronogramaId: cronogramaId
      }
    });

    if (!cuota) {
      return res.status(404).json({
        success: false,
        message: 'Cuota no encontrada'
      });
    }

    if (cuota.pagado) {
      return res.status(400).json({
        success: false,
        message: 'La cuota ya está marcada como pagada'
      });
    }

    const cuotaActualizada = await prisma.cuota.update({
      where: { id: cuotaId },
      data: {
        pagado: true,
        fechaPago: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Cuota marcada como pagada',
      data: cuotaActualizada
    });
  } catch (error) {
    next(error);
  }
};

export default { getCronograma, getCronogramaBySolicitud, marcarCuotaPagada };
