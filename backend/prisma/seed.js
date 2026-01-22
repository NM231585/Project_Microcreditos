import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear roles
  const rolEmprendedor = await prisma.rol.upsert({
    where: { nombre: 'emprendedor' },
    update: {},
    create: {
      nombre: 'emprendedor',
      descripcion: 'Usuario emprendedor rural que solicita microcréditos',
    },
  });

  const rolEvaluador = await prisma.rol.upsert({
    where: { nombre: 'evaluador' },
    update: {},
    create: {
      nombre: 'evaluador',
      descripcion: 'Usuario evaluador que revisa y aprueba solicitudes',
    },
  });

  const rolAdmin = await prisma.rol.upsert({
    where: { nombre: 'admin' },
    update: {},
    create: {
      nombre: 'admin',
      descripcion: 'Administrador del sistema con acceso completo',
    },
  });

  console.log('✅ Roles creados');

  // Crear usuario de prueba emprendedor
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  const emprendedor = await prisma.usuario.upsert({
    where: { correo: 'emprendedor@test.com' },
    update: {},
    create: {
      nombre: 'María González',
      correo: 'emprendedor@test.com',
      telefono: '555-0101',
      password: hashedPassword,
      departamento: 'Santa Cruz',
      municipio: 'Warnes',
      rolId: rolEmprendedor.id,
    },
  });

  // Crear usuario evaluador
  const evaluador = await prisma.usuario.upsert({
    where: { correo: 'evaluador@test.com' },
    update: {},
    create: {
      nombre: 'Carlos Méndez',
      correo: 'evaluador@test.com',
      telefono: '555-0202',
      password: hashedPassword,
      rolId: rolEvaluador.id,
    },
  });

  // Crear usuario administrador
  const admin = await prisma.usuario.upsert({
    where: { correo: 'admin@test.com' },
    update: {},
    create: {
      nombre: 'Admin Sistema',
      correo: 'admin@test.com',
      telefono: '555-0303',
      password: hashedPassword,
      rolId: rolAdmin.id,
    },
  });

  console.log('✅ Usuarios de prueba creados');
  console.log('📧 Emprendedor: emprendedor@test.com / test123');
  console.log('📧 Evaluador: evaluador@test.com / test123');
  console.log('📧 Admin: admin@test.com / test123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
