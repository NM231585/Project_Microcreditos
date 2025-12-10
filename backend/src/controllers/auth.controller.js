import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { nombre, correo, telefono, password, departamento, municipio, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !correo || !telefono || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: nombre, correo, telefono, password'
      });
    }

    // Validar que el correo no exista
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }

    // Buscar el rol
    const rolNombre = rol || 'emprendedor';
    const rolObj = await prisma.rol.findUnique({
      where: { nombre: rolNombre }
    });
    
    if (!rolObj) {
      return res.status(400).json({
        success: false,
        message: 'Rol no válido'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        telefono,
        password: hashedPassword,
        departamento,
        municipio,
        rolId: rolObj.id
      }
    });

    // Generar token
    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        departamento: usuario.departamento,
        municipio: usuario.municipio,
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

    // Buscar usuario con rol
    const usuario = await prisma.usuario.findUnique({
      where: { correo },
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
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

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
