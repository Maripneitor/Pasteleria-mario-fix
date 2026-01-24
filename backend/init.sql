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
DROP TABLE IF EXISTS `employee_transfers`;
DROP TABLE IF EXISTS `folio_histories`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `folio_edit_histories`;
DROP TABLE IF EXISTS `folios`;
DROP TABLE IF EXISTS `fillings`;
DROP TABLE IF EXISTS `flavors`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `branches`;
DROP TABLE IF EXISTS `organizations`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `system_logs`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- SaaS Ready: Organizations + Branches (límites dinámicos)
-- ============================================================

CREATE TABLE IF NOT EXISTS `organizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subscription_level` enum('free','basic','pro','enterprise') NOT NULL DEFAULT 'basic',
  `max_branches` int NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `branches` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `organization_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `max_employees_allowed` int NOT NULL DEFAULT 5,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_branches_org` (`organization_id`),
  CONSTRAINT `branches_ibfk_1`
    FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- TABLE: users
--  - ownerId lo amarro a organizations.id (compatibilidad con tu backend)
--  - Soft delete: deletedAt
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_login_at` datetime DEFAULT NULL,

  -- En tu esquema ya existía ownerId: lo usamos como organization_id
  `ownerId` int DEFAULT NULL,

  `dashboardConfig` json DEFAULT NULL,
  `ownerSeal` text,
  `status` enum('active','pending_verification','banned') DEFAULT 'active',
  `permissions` json DEFAULT NULL,

  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_ownerId` (`ownerId`),
  CONSTRAINT `users_ibfk_org`
    FOREIGN KEY (`ownerId`) REFERENCES `organizations` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- TABLE: clients
--  - branch_id NOT NULL + índice
--  - Soft delete: deletedAt
--  - Unique composite para FK compuesta desde folios
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `branch_id` bigint NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `idx_clients_branch` (`branch_id`),
  UNIQUE KEY `uq_clients_id_branch` (`id`, `branch_id`),
  CONSTRAINT `clients_ibfk_branch`
    FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- Catálogo Maestro: Flavors + Fillings (normalización)
-- ============================================================

CREATE TABLE IF NOT EXISTS `flavors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `branch_id` bigint NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_flavors_branch` (`branch_id`),
  UNIQUE KEY `uq_flavors_name_branch` (`name`, `branch_id`),
  CONSTRAINT `flavors_ibfk_branch`
    FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `fillings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `branch_id` bigint NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_fillings_branch` (`branch_id`),
  UNIQUE KEY `uq_fillings_name_branch` (`name`, `branch_id`),
  CONSTRAINT `fillings_ibfk_branch`
    FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- TABLE: folios
--  - cakeFlavor/filling (texto) -> flavorId/fillingId (FK)
--  - branch_id NOT NULL + índices
--  - FK compuesta para asegurar que clientId sea del mismo branch
--  - Soft delete: deletedAt
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `folios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `folioNumber` varchar(255) NOT NULL,
  `folioType` enum('Sencillo','Especial') NOT NULL,
  `deliveryDate` date NOT NULL,
  `deliveryTime` time NOT NULL,
  `persons` int NOT NULL,

  `flavorId` int NOT NULL,
  `fillingId` int DEFAULT NULL,

  `designDescription` text NOT NULL,
  `dedication` varchar(255) DEFAULT NULL,
  `deliveryLocation` varchar(255) NOT NULL,

  `total` decimal(10,2) NOT NULL,
  `advancePayment` decimal(10,2) NOT NULL DEFAULT '0.00',
  `balance` decimal(10,2) NOT NULL,

  `status` enum('Nuevo','En Producción','Listo para Entrega','Entregado','Cancelado') DEFAULT 'Nuevo',

  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,

  `responsibleUserId` int DEFAULT NULL,
  `clientId` int DEFAULT NULL,
  `branch_id` bigint NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `folioNumber` (`folioNumber`),

  KEY `idx_folios_branch` (`branch_id`),
  KEY `idx_folios_responsibleUserId` (`responsibleUserId`),
  KEY `idx_folios_clientId` (`clientId`),
  KEY `idx_folios_flavorId` (`flavorId`),
  KEY `idx_folios_fillingId` (`fillingId`),

  CONSTRAINT `folios_ibfk_branch`
    FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  -- Anti-errores: el cliente debe pertenecer al mismo branch que el folio
  CONSTRAINT `folios_ibfk_client_branch`
    FOREIGN KEY (`clientId`, `branch_id`) REFERENCES `clients` (`id`, `branch_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT `folios_ibfk_user`
    FOREIGN KEY (`responsibleUserId`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,

  CONSTRAINT `folios_ibfk_flavor`
    FOREIGN KEY (`flavorId`) REFERENCES `flavors` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT `folios_ibfk_filling`
    FOREIGN KEY (`fillingId`) REFERENCES `fillings` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- TABLE: folio_edit_histories (simple)
--  - Soft delete opcional: lo dejo con deletedAt por consistencia
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `folio_edit_histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- TABLE: user_roles
--  - branch_id index (para filtrar rápido)
--  - (no pongo deletedAt aquí para no complicar PK compuesta)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `branch_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `idx_user_roles_branch` (`branch_id`),
  CONSTRAINT `user_roles_ibfk_1`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2`
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_branch`
    FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Auditoría: FolioHistory (quién cambió qué y cuándo)
-- ============================================================
CREATE TABLE IF NOT EXISTS `folio_histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `folioId` int NOT NULL,
  `userId` int DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `action` enum('CREATE','UPDATE','CANCEL','STATUS_CHANGE') NOT NULL DEFAULT 'UPDATE',
  `oldData` json DEFAULT NULL,
  `newData` json DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_folio_histories_folio` (`folioId`),
  KEY `idx_folio_histories_user` (`userId`),
  KEY `idx_folio_histories_branch` (`branch_id`),
  CONSTRAINT `folio_histories_ibfk_folio`
    FOREIGN KEY (`folioId`) REFERENCES `folios` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `folio_histories_ibfk_user`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `folio_histories_ibfk_branch`
    FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- Movimientos de Personal (opcional recomendado)
-- ============================================================
CREATE TABLE IF NOT EXISTS `employee_transfers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `from_branch_id` bigint DEFAULT NULL,
  `to_branch_id` bigint NOT NULL,
  `movedByUserId` int DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_transfers_user` (`userId`),
  KEY `idx_transfers_to_branch` (`to_branch_id`),
  CONSTRAINT `employee_transfers_ibfk_user`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `employee_transfers_ibfk_from_branch`
    FOREIGN KEY (`from_branch_id`) REFERENCES `branches` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `employee_transfers_ibfk_to_branch`
    FOREIGN KEY (`to_branch_id`) REFERENCES `branches` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `employee_transfers_ibfk_moved_by`
    FOREIGN KEY (`movedByUserId`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- TABLE: system_logs (compat)
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
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED BASE
-- ============================================================

-- 1) Organización y sucursal demo (para que branch_id no sea NULL)
INSERT INTO `organizations` (`id`, `name`, `subscription_level`, `max_branches`)
VALUES (1, 'Demo Org', 'basic', 3)
ON DUPLICATE KEY UPDATE
  `name`=VALUES(`name`),
  `subscription_level`=VALUES(`subscription_level`),
  `max_branches`=VALUES(`max_branches`);

INSERT INTO `branches` (`id`, `organization_id`, `name`, `max_employees_allowed`, `is_active`)
VALUES (1, 1, 'Sucursal Centro', 10, 1)
ON DUPLICATE KEY UPDATE
  `organization_id`=VALUES(`organization_id`),
  `name`=VALUES(`name`),
  `max_employees_allowed`=VALUES(`max_employees_allowed`),
  `is_active`=VALUES(`is_active`);

-- Roles fijos (id estables)
INSERT INTO `roles` (`id`, `name`, `scope`, `description`) VALUES
(1, 'Administrador', 'Global', 'Administrador del Sistema'),
(2, 'Dueño', 'Branch', 'Dueño de Sucursal'),
(3, 'Empleado', 'Branch', 'Empleado Regular')
ON DUPLICATE KEY UPDATE
  `name`=VALUES(`name`),
  `scope`=VALUES(`scope`),
  `description`=VALUES(`description`);

-- Catálogos base (para branch 1)
INSERT INTO `flavors` (`name`, `active`, `branch_id`) VALUES
('Chocolate', 1, 1),
('Vainilla', 1, 1),
('Fresa', 1, 1)
ON DUPLICATE KEY UPDATE `active`=VALUES(`active`);

INSERT INTO `fillings` (`name`, `active`, `branch_id`) VALUES
('Crema', 1, 1),
('Mermelada', 1, 1),
('Nutella', 1, 1)
ON DUPLICATE KEY UPDATE `active`=VALUES(`active`);

-- Admin (si ya existe por email, se actualiza password y datos)
INSERT INTO `users` (`id`, `username`, `email`, `password`, `is_active`, `status`, `ownerId`, `createdAt`, `updatedAt`)
VALUES
(3, 'Mario Admin', 'admin@gmail.com',
 '$2a$10$vI8NoizvNoL5Xh36E6H2G.A/fLw/8q6Gv6Vp.E6N/F7jLhNl.O6G6',
 1, 'active', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `username`=VALUES(`username`),
  `password`=VALUES(`password`),
  `is_active`=VALUES(`is_active`),
  `status`=VALUES(`status`),
  `ownerId`=VALUES(`ownerId`),
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
