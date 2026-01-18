const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para REGISTRAR un nuevo usuario
// Función para REGISTRAR un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, secretKey } = req.body;

    // 1. Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    // Fortaleza de contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    // Validación de Roles
    // Solo permitir crear Admins si se proporciona una clave secreta (simulación de seguridad)
    // O si el usuario que hace la petición es Admin (middlewares posteriores se encargarían de auth)
    // Para simplificar: 'Administrador' requiere clave maestra si es registro público
    if (role === 'Administrador' && secretKey !== process.env.ADMIN_SECRET_KEY) {
      // Fallback inseguro para dev si no hay variable:
      if (secretKey !== 'admin123') {
        return res.status(403).json({ message: "No autorizado para crear administradores." });
      }
    }

    const assignedRole = ['Administrador', 'Vendedor', 'Repostero'].includes(role) ? role : 'Vendedor';

    // 2. Verificar duplicados
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // 3. Crear Usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    // 4. Generar Token inmediatamento (Auto-Login)
    const payload = {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto_temporal', { expiresIn: '8h' });

    // Excluir password
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userResponse,
      token: token
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email ya está registrado.' }); // Redundante pero seguro
    }
    console.error("Error en registro:", error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario.' });
  }
};

// Función para INICIAR SESIÓN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar al usuario por su email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 2. Comparar la contraseña enviada con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // 3. Si todo es correcto, crear un Token (JWT)
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    // --- CORRECCIÓN APLICADA ---
    // Se utiliza la variable de entorno JWT_SECRET para firmar el token,
    // en lugar de tener la clave secreta directamente en el código.
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};