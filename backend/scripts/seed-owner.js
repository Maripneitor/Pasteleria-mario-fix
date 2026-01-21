const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { User } = require('../server/models');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../server/config/database');

async function seedOwner() {
    try {
        await sequelize.authenticate();
        console.log('🔌 Conexión a DB exitosa.');

        const email = 'dueño@pastelerialafiesta.com';
        const exists = await User.findOne({ where: { email } });

        if (exists) {
            console.log('✅ El usuario dueño "Pastelería La Fiesta" ya existe.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('Fiesta2026!', 10);

        await User.create({
            username: 'Pastelería La Fiesta',
            email: email,
            password: hashedPassword,
            role: 'Dueño',
            status: 'active',
            ownerId: null, // Root Tenant
            permissions: { root: true }
        });

        console.log('🚀 Usuario Dueño "Pastelería La Fiesta" creado exitosamente.');
        console.log('📧 Email: dueño@pastelerialafiesta.com');
        console.log('🔑 Pass: Fiesta2026!');

    } catch (error) {
        console.error('❌ Error seeding owner:', error);
    } finally {
        await sequelize.close();
    }
}

seedOwner();
