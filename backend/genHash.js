const bcrypt = require('bcryptjs');
const pass = 'admin123456';
bcrypt.hash(pass, 10).then(hash => console.log(hash));
