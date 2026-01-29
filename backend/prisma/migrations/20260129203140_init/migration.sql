-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `departamento` VARCHAR(100) NULL,
    `municipio` VARCHAR(100) NULL,
    `rol_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitudes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emprendedor_id` INTEGER NOT NULL,
    `estado` ENUM('borrador', 'enviado', 'en_evaluacion', 'aprobado', 'rechazado', 'devuelto') NOT NULL DEFAULT 'borrador',
    `datos_personales` JSON NULL,
    `datos_negocio` JSON NULL,
    `datos_solicitud` JSON NULL,
    `documentos` JSON NULL,
    `score_automatico` DECIMAL(5, 2) NULL,
    `observaciones` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `solicitudes_emprendedor_id_idx`(`emprendedor_id`),
    INDEX `solicitudes_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cronogramas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `solicitud_id` INTEGER NOT NULL,
    `tasa_interes` DECIMAL(5, 2) NOT NULL DEFAULT 12.00,
    `monto_total` DECIMAL(10, 2) NOT NULL,
    `plazo_meses` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cronogramas_solicitud_id_key`(`solicitud_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuotas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cronograma_id` INTEGER NOT NULL,
    `numero` INTEGER NOT NULL,
    `fecha_vencimiento` DATE NOT NULL,
    `capital` DECIMAL(10, 2) NOT NULL,
    `interes` DECIMAL(10, 2) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `saldo` DECIMAL(10, 2) NOT NULL,
    `pagado` BOOLEAN NOT NULL DEFAULT false,
    `fecha_pago` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `cuotas_cronograma_id_idx`(`cronograma_id`),
    INDEX `cuotas_pagado_idx`(`pagado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitudes` ADD CONSTRAINT `solicitudes_emprendedor_id_fkey` FOREIGN KEY (`emprendedor_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cronogramas` ADD CONSTRAINT `cronogramas_solicitud_id_fkey` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cuotas` ADD CONSTRAINT `cuotas_cronograma_id_fkey` FOREIGN KEY (`cronograma_id`) REFERENCES `cronogramas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
