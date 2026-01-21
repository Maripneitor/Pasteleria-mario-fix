const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { User } = require('../server/models');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../server/config/database');

async function update() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');
        const hash = await bcrypt.hash('Fiesta2026!', 10);
        const [updated] = await User.update({ password: hash }, { where: { email: 'dueño@pastelerialafiesta.com' } });
        console.log('Updated rows:', updated);
    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}
update();
