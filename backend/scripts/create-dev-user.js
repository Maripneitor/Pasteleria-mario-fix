const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { sequelize } = require('../server/models');
const User = require('../server/models/user');
const bcrypt = require('bcryptjs'); // Usamos bcryptjs para consistencia

async function createDevUser() {
    try {
        const devEmail = 'mario@dev.com';
        const devUsername = 'Mario Dev';
        const rawPassword = 'Admin1234';

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
            // BUSCAR EL ROL ADMINISTRADOR (ID 1) Y VINCULARLO
            const { Role, UserRole } = require('../server/models'); // Local require to ensure context

            const [role] = await Role.findOrCreate({
                where: { name: 'Administrador' },
                defaults: { scope: 'Global', description: 'Admin de Sistema' }
            });

            await UserRole.findOrCreate({
                where: { user_id: devUser.id, role_id: role.id }
            });

            console.log("🛠️ Superusuario Mario Dev creado y vinculado al rol Administrador");
        }

    } catch (error) {
        console.error('❌ Error creando usuario Dev:', error);
    }
}

module.exports = createDevUser;
