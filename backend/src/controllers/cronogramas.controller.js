import models from '../models/index.js';

const { Cronograma, Cuota, Solicitud } = models;

// @desc    Obtener cronograma por ID
// @route   GET /api/cronogramas/:id
// @access  Private
export const getCronograma = async (req, res, next) => {
  try {
    const cronograma = await Cronograma.findByPk(req.params.id, {
      include: [
        {
          model: Cuota,
          as: 'cuotas',
          order: [['numero', 'ASC']]
        },
        {
          model: Solicitud,
          as: 'solicitud'
        }
      ]
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
    const cronograma = await Cronograma.findOne({
      where: { solicitud_id: req.params.solicitudId },
      include: [{
        model: Cuota,
        as: 'cuotas',
        order: [['numero', 'ASC']]
      }]
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
    const cuota = await Cuota.findOne({
      where: {
        id: req.params.cuotaId,
        cronograma_id: req.params.id
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

    await cuota.update({
      pagado: true,
      fecha_pago: new Date()
    });

    res.json({
      success: true,
      message: 'Cuota marcada como pagada',
      data: cuota
    });
  } catch (error) {
    next(error);
  }
};

export default { getCronograma, getCronogramaBySolicitud, marcarCuotaPagada };
