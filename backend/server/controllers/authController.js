const { User, SystemLog } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

// Función para REGISTRAR un nuevo usuario
// Función para REGISTRAR un nuevo usuario
// Función para REGISTRAR un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, secretKey } = req.body;
    let ownerId = null;
    let assignedRole = 'Empleado'; // Default to Employee
    let status = 'active';

    // 1. Validaciones básicas
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    // 2. Verificar duplicados (Antes de cualquier lógica compleja)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' }); // 409 Conflict
    }

    // 3. --- LOGICA DE ROLES Y MULTI-TENANCY ---

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
        ownerId = parseInt(decodedInvite.ownerId, 10); // Ensure integer
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
        ownerId = parseInt(requester.id, 10); // STRICT: Owner creates employees for themselves
        status = 'active'; // Owner created, so it's auto-verified
      } else if (requester.role === 'Administrador') {
        // Admin creating Owner/Other -> Allow manual ownerId assignment if provided in body
        assignedRole = role || 'Dueño';
        // Si el admin envía un ownerId específico en el body, úsalo (para asignar empleado a dueño)
        if (req.body.ownerId && assignedRole === 'Empleado') {
          ownerId = parseInt(req.body.ownerId, 10);
        } else if (assignedRole === 'Dueño') {
          ownerId = null; // Owners are roots
        }
        status = 'active';
      } else {
        return res.status(403).json({ message: "No tienes permisos para registrar usuarios." });
      }
    }
    // CASE 3: Public Registration (New Tenants)
    else {
      // ✅ PERMITIR REGISTRO PÚBLICO
      // Si no hay token de invitación y nadie está logueado, asumimos que es un nuevo Dueño registrándose.

      // Restricción de seguridad: NUNCA permitir registrar 'Administrador' públicamente
      if (role === 'Administrador') {
        await SystemLog.create({
          level: 'security',
          section: 'Auth',
          message: `Intento de creación de Admin bloqueado: ${email}`,
          meta: { email, ip: req.ip, body: req.body }
        });
        return res.status(403).json({ message: "No puedes registrarte como Administrador públicamente." });
      }

      // Por defecto, registro público crea un 'Dueño' (Tenant)
      // Si el frontend envía 'Empleado' pero sin token, lo forzamos a 'Dueño' o rechazamos?
      // Política: Registro público = Nueva Pastelería = Dueño.
      // Si quiere ser empleado, necesita invitación.
      if (role === 'Empleado') {
        return res.status(403).json({ message: "Para registrarte como Empleado necesitas un enlace de invitación de tu jefe." });
      }

      assignedRole = 'Dueño';
      ownerId = null; // Es root
      status = 'active'; // O 'pending_verification' si quisieras confirmar emails

      console.log(`🌍 Registro Público iniciado: ${email} como ${assignedRole}`);
    }

    // 4. Crear Usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      phone: req.body.phone || null,
      password: hashedPassword,
      role: assignedRole,
      ownerId: ownerId,
      status: status,
      dashboardConfig: {},
      permissions: {}
    });

    // Enviar correo de bienvenida (async)
    try {
      emailService.sendWelcomeEmail(email, username, password);
    } catch (err) {
      console.error("Error enviando email bienvenida:", err);
    }

    // 5. Generar Token y Respuesta
    let token = null;

    // Prepare standardized user object
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      ownerId: newUser.ownerId,
      status: newUser.status,
      permissions: newUser.permissions || {}
    };

    if (!requester || inviteToken) {
      // Auto-login logic for self-registration or invite-registration
      const payload = { ...userResponse };
      // Remove email from payload to keep it smaller if not needed, but keeping standard fields helps
      // Payload usually needs id, role, ownerId, status, permissions
      token = jwt.sign(payload, process.env.JWT_SECRET || 'secreto_temporal', { expiresIn: '8h' });
    }

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userResponse,
      token: token
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El email ya está registrado.' });
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

    // 3. Crear Token (JWT)
    // Standard payload
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      ownerId: user.ownerId,
      status: user.status,
      permissions: user.permissions || {}
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    // 4. Preparar respuesta de usuario estandarizada
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      ownerId: user.ownerId,
      status: user.status,
      permissions: user.permissions || {}
    };

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: userResponse,
      token: token
    });

    console.log(`🔑 [AUTH] Usuario: ${user.username} | Rol: ${user.role} | OwnerID: ${user.ownerId}`);

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