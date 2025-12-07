// Middleware para verificar roles de usuario
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    if (!roles.includes(req.user.rol.nombre)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.user.rol.nombre} no tiene permiso para acceder a este recurso`
      });
    }

    next();
  };
};

export default { authorize };
