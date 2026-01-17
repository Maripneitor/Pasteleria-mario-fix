const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
        type: DataTypes.ENUM('Administrador', 'Usuario', 'Decorador'),
        defaultValue: 'Usuario'
    }
}, { tableName: 'users' });

async function addDev() {
    try {
        const hash = await bcrypt.hash('mario123', 10);

        // Usamos 'Administrador' porque es un valor permitido en tu ENUM
        await User.create({
            username: 'Mario Efrain (Dev)',
            email: 'mario@dev.com',
            password: hash,
            role: 'Administrador'
        });

        console.log('-----------------------------------------');
        console.log('✅ PERFIL DE DESARROLLADOR CONFIGURADO');
        console.log('📧 Email: mario@dev.com');
        console.log('🔑 Password: mario123');
        console.log('🛡️  Rol: Administrador');
        console.log('-----------------------------------------');
        process.exit();
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('ℹ️ El usuario ya existe en la base de datos.');
        } else {
            console.error('❌ Error:', error.message);
        }
        process.exit(1);
    }
}

addDev();