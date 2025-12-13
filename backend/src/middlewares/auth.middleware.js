import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const protect = async (req, res, next) => {
  let token;

  // Obtener token del header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar que el token existe
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
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      include: {
        rol: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, usuario no encontrado'
      });
    }

    // Agregar usuario a la request
    req.user = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, token inválido'
    });
  }
};

export default protect;
