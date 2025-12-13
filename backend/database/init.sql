-- Script de inicialización de base de datos para XAMPP/MySQL
-- Ejecutar este script en phpMyAdmin o MySQL Workbench

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS microcreditos_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE microcreditos_db;

-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre ENUM('emprendedor', 'evaluador', 'admin') NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar roles iniciales
INSERT INTO roles (nombre, descripcion) VALUES
('emprendedor', 'Usuario emprendedor que solicita microcréditos'),
('evaluador', 'Usuario evaluador que revisa solicitudes'),
('admin', 'Administrador del sistema')
ON DUPLICATE KEY UPDATE descripcion=VALUES(descripcion);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  telefono VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  departamento VARCHAR(100),
  municipio VARCHAR(100),
  rol_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  emprendedor_id INT NOT NULL,
  estado ENUM('borrador', 'enviado', 'en_evaluacion', 'aprobado', 'rechazado', 'devuelto') NOT NULL DEFAULT 'borrador',
  datos_personales JSON,
  datos_negocio JSON,
  datos_solicitud JSON,
  documentos JSON,
  score_automatico DECIMAL(5,2),
  cronograma_id INT,
  observaciones TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (emprendedor_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de cronogramas
CREATE TABLE IF NOT EXISTS cronogramas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitud_id INT NOT NULL UNIQUE,
  tasa_interes DECIMAL(5,2) NOT NULL DEFAULT 12.00,
  monto_total DECIMAL(10,2) NOT NULL,
  plazo_meses INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de cuotas
CREATE TABLE IF NOT EXISTS cuotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cronograma_id INT NOT NULL,
  numero INT NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  capital DECIMAL(10,2) NOT NULL,
  interes DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  saldo DECIMAL(10,2) NOT NULL,
  pagado BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_pago DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cronograma_id) REFERENCES cronogramas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar foreign key de cronograma_id en solicitudes
ALTER TABLE solicitudes
ADD CONSTRAINT fk_solicitud_cronograma
FOREIGN KEY (cronograma_id) REFERENCES cronogramas(id) ON DELETE SET NULL;

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_solicitudes_emprendedor ON solicitudes(emprendedor_id);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX idx_cuotas_cronograma ON cuotas(cronograma_id);
CREATE INDEX idx_cuotas_pagado ON cuotas(pagado);

SELECT 'Base de datos creada exitosamente!' AS mensaje;
