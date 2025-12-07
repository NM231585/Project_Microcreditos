import jwt from 'jsonwebtoken';
import models from '../models/index.js';

const { Usuario, Rol } = models;

// Middleware para verificar JWT
export const protect = async (req, res, next) => {
  let token;

  // Verificar si el token está en el header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, token no proporcionado'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener usuario del token
    req.user = await Usuario.findByPk(decoded.id, {
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['id', 'nombre']
      }],
      attributes: { exclude: ['password'] }
    });

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, token inválido'
    });
  }
};

export default { protect };
