-- Crear usuario adicional
CREATE USER IF NOT EXISTS 'pasteleria_user'@'%' IDENTIFIED BY 'user_password';
GRANT ALL PRIVILEGES ON pasteleria_db.* TO 'pasteleria_user'@'%';
FLUSH PRIVILEGES;

-- Usar la base de datos
USE pasteleria_db;

-- Crear tabla de usuarios si no existe
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar usuario admin de prueba
-- Contraseña: admin123 (bcrypt)
INSERT IGNORE INTO users (email, password, name, role) VALUES
('admin@pasteleria.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.ML3Lp6fH7Qe6ZzpgV/Bb5t7dJfqJXW', 'Administrador', 'admin'),
('user@pasteleria.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.ML3Lp6fH7Qe6ZzpgV/Bb5t7dJfqJXW', 'Usuario Demo', 'user');

-- Crear tabla de productos de ejemplo
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  stock INT DEFAULT 0,
  imagen_url VARCHAR(500)
);

INSERT IGNORE INTO productos (nombre, precio, descripcion, categoria) VALUES
('Pastel de Chocolate', 25.99, 'Delicioso pastel de chocolate belga', 'Pasteles'),
('Tarta de Fresa', 18.50, 'Tarta fresca con fresas naturales', 'Tartas'),
('Cupcakes Vainilla', 12.75, 'Pack de 6 cupcakes de vainilla', 'Cupcakes');
