const { User } = require('../models');

// OBTENER todos los usuarios
// OBTENER todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const { role, ownerId } = req.user;
    let whereClause = {};

    if (role === 'Dueño') {
      // Dueño solo ve a sus empleados (y a sí mismo si se requiere, pero usualmente gestión de empleados)
      whereClause = {
        [require('sequelize').Op.or]: [
          { ownerId: req.user.id },
          { id: req.user.id }
        ]
      };
    } else if (role === 'Empleado') {
      // Empleado ve a sus compañeros (mismo ownerId)
      if (ownerId) {
        whereClause = { ownerId: ownerId };
      } else {
        // 404 paranoia o solo mostrarse a sí mismo
        whereClause = { id: req.user.id };
      }
    }
    // Admin ve todo (whereClause vacío)

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] } // Excluimos la contraseña de la respuesta
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

// CREAR un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    // Excluimos la contraseña de la respuesta por seguridad
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ message: 'Error de validación', errors });
    }
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
};

// ACTUALIZAR un usuario existente (ej. cambiar rol)
// ACTUALIZAR un usuario existente
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, dashboardConfig, ownerId, ownerSeal } = req.body;

    // Verificar permisos
    if (req.user.role !== 'Administrador' && req.user.id != userId && req.user.role !== 'Dueño') {
      return res.status(403).json({ message: 'No tienes permiso para editar este usuario.' });
    }

    // Si es Dueño editando, verificar que el usuario target sea suyo
    if (req.user.role === 'Dueño') {
      const targetUser = await User.findByPk(userId);
      if (targetUser && targetUser.ownerId !== req.user.id) {
        return res.status(403).json({ message: 'No puedes editar usuarios de otra sucursal.' });
      }
    }

    if (req.user.id == userId && role && role !== req.user.role && role !== 'Administrador') {
      return res.status(403).json({ message: 'No puedes quitarte tu propio rol de administrador.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (role) user.role = role;
    if (ownerId !== undefined && req.user.role === 'Administrador') user.ownerId = ownerId; // Solo admin puede mover usuarios entre dueños
    if (dashboardConfig) user.dashboardConfig = dashboardConfig;
    if (ownerSeal !== undefined) user.ownerSeal = ownerSeal;

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({ message: 'Usuario actualizado correctamente.', user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario.', error: error.message });
  }
};

// ELIMINAR un usuario
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id == userId) {
      return res.status(403).json({ message: 'No puedes eliminar tu propia cuenta de administrador.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario.', error: error.message });
  }
};