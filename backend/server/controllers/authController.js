const { User, SystemLog } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

// Función para REGISTRAR un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, secretKey } = req.body;
    let ownerId = null;
    let assignedRole = 'Empleado'; // Default to Employee
    let status = 'active';

    // 1. Validaciones
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    // --- LOGICA DE ROLES Y MULTI-TENANCY ---

    // A) Registro Público (DESHABILITADO POR SEGURIDAD)
    const requester = req.user;
    const { inviteToken } = req.body;

    // CASE 1: Registration via Invite Token
    if (inviteToken) {
      try {
        const decodedInvite = jwt.verify(inviteToken, process.env.JWT_SECRET);
        if (decodedInvite.type !== 'invite' || !decodedInvite.ownerId) {
          return res.status(400).json({ message: "Invitación inválida." });
        }
        assignedRole = 'Empleado';
        ownerId = decodedInvite.ownerId;
        status = 'active';
      } catch (e) {
        return res.status(400).json({ message: "El enlace de invitación ha expirado o no es válido." });
      }
    }
    // CASE 2: Internal Registration (by Logged User)
    else if (requester) {
      if (requester.role === 'Dueño') {
        // Owner creating Employee manually -> STRICT INHERITANCE
        assignedRole = 'Empleado';
        ownerId = requester.id; // STRICT: Owner creates employees for themselves
        status = 'active'; // Owner created, so it's auto-verified
      } else if (requester.role === 'Administrador') {
        // Admin creating Owner/Other -> Allow manual ownerId assignment if provided in body
        assignedRole = role || 'Dueño';
        // Si el admin envía un ownerId específico en el body, úsalo (para asignar empleado a dueño)
        if (req.body.ownerId && assignedRole === 'Empleado') {
          ownerId = req.body.ownerId;
        } else if (assignedRole === 'Dueño') {
          ownerId = null; // Owners are roots
        }
        status = 'active';
      } else {
        return res.status(403).json({ message: "No tienes permisos para registrar usuarios." });
      }
    }
    // CASE 3: Public Registration (Block if neither invite nor authorized requester)
    else {
      await SystemLog.create({
        level: 'security',
        section: 'Auth',
        message: `Intento de registro público bloqueado: ${email}`,
        meta: { email, ip: req.ip, body: req.body }
      });
      return res.status(403).json({ message: "El registro público está cerrado. Contacte al administrador o use un enlace de invitación." });
    }


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
      phone: req.body.phone || null, // Capture phone
      password: hashedPassword,
      role: assignedRole,
      ownerId: ownerId,
      status: status,
      dashboardConfig: {}
    });

    // Enviar correo de bienvenida (async, no bloquear respuesta)
    // Solo enviar si es un empleado creado por dueño o registro publico, 
    // y si tenemos el password en plano (que sí lo tenemos aquí como 'password')
    emailService.sendWelcomeEmail(email, username, password);

    // 4. Generar Token (Solo si es registro propio, si es creación por otro, quizás no queramos autologin)
    // Si hay requester, es creación administrativa -> No devolver token de login para el nuevo usuario.
    // Si no hay requester, es auto-registro -> Devolver Token.

    let token = null;
    if (!requester) {
      const payload = {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        ownerId: newUser.ownerId
      };
      token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto_temporal', { expiresIn: '8h' });
    }

    // Excluir password
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userResponse,
      token: token // Puede ser null
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email ya está registrado.' });
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
      // Log Security Event: Unknown User
      await SystemLog.create({
        level: 'warn',
        section: 'Auth',
        message: `Intento de login fallido: Usuario no encontrado (${email})`,
        meta: { email, ip: req.ip }
      });
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 2. Comparar la contraseña enviada con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log Security Event: Bad Password
      await SystemLog.create({
        level: 'warn',
        section: 'Auth',
        message: `Intento de login fallido: Contraseña incorrecta para ${email}`,
        meta: { email, userId: user.id, ip: req.ip }
      });
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // 3. Si todo es correcto, crear un Token (JWT)
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      ownerId: user.ownerId
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

// Función para generar TOKEN DE INVITACIÓN (Solo Dueños)
exports.generateInviteToken = async (req, res) => {
  try {
    // Validar que sea Dueño
    if (req.user.role !== 'Dueño') {
      return res.status(403).json({ message: "Solo los dueños pueden generar invitaciones." });
    }

    const payload = {
      ownerId: req.user.id,
      type: 'invite'
    };

    // Token válido por 24 horas
    const inviteToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Retornar URL relativa o absoluta (para el QR)
    // La URL final será construida por el frontend, aquí solo devolvemos el token.
    res.json({
      token: inviteToken,
      expiresIn: '24h'
    });

  } catch (error) {
    console.error("Error generando invitación:", error);
    res.status(500).json({ message: "Error al generar la invitación." });
  }
};