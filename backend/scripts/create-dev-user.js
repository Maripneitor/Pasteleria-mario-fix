const { sequelize } = require('../server/models');
const User = require('../server/models/user');
const bcrypt = require('bcrypt'); // Asegurarnos de usar 'bcrypt', si no está en package.json usaremos 'bcryptjs' o lo que haya. Verificaremos package.json primero. Si el modelo no usa bcrypt explícitamente en create, lo usaremos aquí.

// NOTA: El usuario pidió bcrypt. Vamos a asumir que está instalado. Si no, fallará y lo arreglaré.
// El hash ya fue proporcionado: $2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

async function createDevUser() {
    try {
        const devEmail = 'mario@dev.com';
        const devUsername = 'Mario Dev';

        // Check if user exists
        const existingUser = await User.findOne({
            where: {
                email: devEmail
            }
        });

        if (existingUser) {
            // Opcional: Actualizar si ya existe para asegurar permisos, pero el prompt dice "Crear... si no detecta"
            console.log('ℹ️ El usuario Mario Dev ya existe.');
            return;
        }

        console.log('⚙️ Creando Superusuario Mario Dev...');

        const devUser = await User.create({
            username: devUsername,
            email: devEmail,
            password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Hash de 'password123'
            role: 'Administrador',
            status: 'active',
            permissions: { "canUseAI": true, "canViewStats": true, "isDev": true },
            // Campos adicionales requeridos por el modelo para evitar errores
            ownerId: null, // Root
            dashboardConfig: {},
            ownerSeal: null
        });

        if (devUser) {
            console.log("🛠️ Superusuario Mario Dev restaurado con éxito");
        }

    } catch (error) {
        console.error('❌ Error creando usuario Dev:', error);
    }
}

module.exports = createDevUser;
