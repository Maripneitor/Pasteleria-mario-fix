-- ============================================================
-- PASTELERIA DB - INIT (Schema + Seed)
-- Compatible con MySQL 8.0.45 (Docker)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `pasteleria_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE `pasteleria_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- DROP (orden seguro por llaves foráneas)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `folio_edit_histories`;
DROP TABLE IF EXISTS `folios`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `system_logs`;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- TABLE: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,
  `ownerId` int DEFAULT NULL,
  `dashboardConfig` json DEFAULT NULL,
  `ownerSeal` text,
  `status` enum('active','pending_verification','banned') DEFAULT 'active',
  `permissions` json DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- TABLE: clients
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `branch_id` bigint DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- TABLE: folios
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `folios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `folioNumber` varchar(255) NOT NULL,
  `folioType` enum('Sencillo','Especial') NOT NULL,
  `deliveryDate` date NOT NULL,
  `deliveryTime` time NOT NULL,
  `persons` int NOT NULL,
  `cakeFlavor` text NOT NULL,
  `filling` text,
  `designDescription` text NOT NULL,
  `dedication` varchar(255) DEFAULT NULL,
  `deliveryLocation` varchar(255) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `advancePayment` decimal(10,2) NOT NULL DEFAULT '0.00',
  `balance` decimal(10,2) NOT NULL,
  `status` enum('Nuevo','En Producción','Listo para Entrega','Entregado','Cancelado') DEFAULT 'Nuevo',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `responsibleUserId` int DEFAULT NULL,
  `clientId` int DEFAULT NULL,
  `branch_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `folioNumber` (`folioNumber`),
  KEY `responsibleUserId` (`responsibleUserId`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `folios_ibfk_1`
    FOREIGN KEY (`responsibleUserId`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `folios_ibfk_2`
    FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- TABLE: folio_edit_histories
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `folio_edit_histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `folioId` int DEFAULT NULL,
  `editorUserId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `folioId` (`folioId`),
  KEY `editorUserId` (`editorUserId`),
  CONSTRAINT `folio_edit_histories_ibfk_1`
    FOREIGN KEY (`folioId`) REFERENCES `folios` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `folio_edit_histories_ibfk_2`
    FOREIGN KEY (`editorUserId`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- TABLE: roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `scope` enum('Global','Branch') DEFAULT 'Branch',
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- TABLE: user_roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `branch_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `user_roles_ibfk_1`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2`
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- ✅ TABLE: system_logs (ya completa, sin ALTER manual)
-- Mantengo `timestamp` por compatibilidad con tu backend actual
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `level` varchar(255) NOT NULL,
  `section` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `meta` json DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED BASE (roles + admin)
-- ============================================================

-- Roles fijos (id estables)
INSERT INTO `roles` (`id`, `name`, `scope`, `description`) VALUES
(1, 'Administrador', 'Global', 'Administrador del Sistema'),
(2, 'Dueño', 'Branch', 'Dueño de Sucursal'),
(3, 'Empleado', 'Branch', 'Empleado Regular')
ON DUPLICATE KEY UPDATE
  `name`=VALUES(`name`),
  `scope`=VALUES(`scope`),
  `description`=VALUES(`description`);

-- Admin (si ya existe por email, se actualiza password y datos)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `is_active`, `status`, `createdAt`, `updatedAt`)
VALUES
(3, 'Mario Admin', 'admin@gmail.com',
 '$2a$10$vI8NoizvNoL5Xh36E6H2G.A/fLw/8q6Gv6Vp.E6N/F7jLhNl.O6G6',
 1, 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `username`=VALUES(`username`),
  `password`=VALUES(`password`),
  `is_active`=VALUES(`is_active`),
  `status`=VALUES(`status`),
  `updatedAt`=NOW();

-- Asignar rol admin a user_id=3 sin duplicar ni romper FK
INSERT INTO `user_roles` (`user_id`, `role_id`)
SELECT 3, 1
WHERE EXISTS (SELECT 1 FROM `users` WHERE `id`=3)
  AND EXISTS (SELECT 1 FROM `roles` WHERE `id`=1)
  AND NOT EXISTS (
    SELECT 1 FROM `user_roles` WHERE `user_id`=3 AND `role_id`=1
  );

-- (Opcional) Si también quieres intentar asignar admin a user_id=4 solo si existe:
INSERT INTO `user_roles` (`user_id`, `role_id`)
SELECT 4, 1
WHERE EXISTS (SELECT 1 FROM `users` WHERE `id`=4)
  AND EXISTS (SELECT 1 FROM `roles` WHERE `id`=1)
  AND NOT EXISTS (
    SELECT 1 FROM `user_roles` WHERE `user_id`=4 AND `role_id`=1
  );
