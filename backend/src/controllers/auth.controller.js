import models from '../models/index.js';

const { Usuario, Rol } = models;

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { nombre, correo, telefono, password, departamento, municipio, rol } = req.body;

    // Validar que el correo no exista
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }

    // Buscar el rol
    const rolNombre = rol || 'emprendedor';
    const rolObj = await Rol.findOne({ where: { nombre: rolNombre } });
    
    if (!rolObj) {
      return res.status(400).json({
        success: false,
        message: 'Rol no válido'
      });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      correo,
      telefono,
      password,
      departamento,
      municipio,
      rol_id: rolObj.id
    });

    // Generar token
    const token = usuario.generateToken();

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: rolNombre
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { correo, password } = req.body;

    // Validar campos
    if (!correo || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione correo y contraseña'
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ 
      where: { correo },
      include: [{
        model: Rol,
        as: 'rol',
        attributes: ['id', 'nombre']
      }]
    });

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await usuario.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = usuario.generateToken();

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        departamento: usuario.departamento,
        municipio: usuario.municipio,
        rol: usuario.rol.nombre
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user.id,
        nombre: req.user.nombre,
        correo: req.user.correo,
        telefono: req.user.telefono,
        departamento: req.user.departamento,
        municipio: req.user.municipio,
        rol: req.user.rol.nombre
      }
    });
  } catch (error) {
    next(error);
  }
};

export default { register, login, getMe };
