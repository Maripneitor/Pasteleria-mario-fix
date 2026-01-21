const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { sequelize } = require('../server/models');
const User = require('../server/models/user');
const bcrypt = require('bcryptjs'); // Usamos bcryptjs para consistencia

async function createDevUser() {
    try {
        const devEmail = 'mario@dev.com';
        const devUsername = 'Mario Dev';
        const rawPassword = 'password123';

        // Check if user exists
        const existingUser = await User.findOne({
            where: {
                email: devEmail
            }
        });

        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        if (existingUser) {
            console.log('ℹ️ El usuario Mario Dev ya existe. Actualizando contraseña para dev...');
            // Actualizamos la contraseña por si acaso cambió el algoritmo/salt
            await existingUser.update({ password: hashedPassword });
            console.log('✅ Contraseña de Mario Dev actualizada (bcryptjs).');
            return;
        }

        console.log('⚙️ Creando Superusuario Mario Dev...');

        const devUser = await User.create({
            username: devUsername,
            email: devEmail,
            password: hashedPassword,
            role: 'Administrador',
            status: 'active',
            permissions: { "canUseAI": true, "canViewStats": true, "isDev": true },
            ownerId: null, // Root
            dashboardConfig: {},
            ownerSeal: null
        });

        if (devUser) {
            console.log("🛠️ Superusuario Mario Dev creado con éxito");
        }

    } catch (error) {
        console.error('❌ Error creando usuario Dev:', error);
    }
}

module.exports = createDevUser;
