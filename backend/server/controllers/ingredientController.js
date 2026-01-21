const { Flavor, Filling } = require('../models');
const { Op } = require('sequelize');

const ingredientController = {
    // --- SEEDING (Idempotent & Safe) ---
    seedIngredients: async () => {
        // Only run if table is empty to avoid duplicates on every restart
        // In a real migration, we'd use migration files.
        // For now, we leave this as is or modify to just log.
        // Skipping auto-seed to prevent overwriting dynamic data with defaults repeatedly.
        console.log("ℹ️ Seeding logic skipped to preserve dynamic data compatibility.");
    },

    // --- FLAVORS ---
    getFlavors: async (req, res) => {
        try {
            const user = req.user;
            let whereClause = {};

            if (user) {
                // Logic: Show Global Items (ownerId: null) AND User's Owner Items
                const rootOwnerId = user.role === 'Dueño' ? user.id : user.ownerId;
                if (rootOwnerId) {
                    whereClause = {
                        [Op.or]: [
                            { ownerId: null },
                            { ownerId: rootOwnerId }
                        ]
                    };
                } else {
                    // Fallback for independent users or super-admins without ownerId check??
                    // If User role has no ownerId (e.g. initial super admin), maybe show everything?
                    // Let's stick to safe default: Global Only if no specific owner context
                    whereClause = { ownerId: null };
                }
            } else {
                // Public access? Maybe allow global only
                whereClause = { ownerId: null };
            }

            // Optional: Filter by 'available: true' for frontend selectors, but admin table needs all.
            // Let's create a query param `onlyAvailable=true`
            if (req.query.onlyAvailable === 'true') {
                whereClause.available = true;
            }

            const flavors = await Flavor.findAll({
                where: whereClause,
                order: [['name', 'ASC']]
            });
            res.json(flavors);
        } catch (error) {
            console.error("Error getting flavors:", error);
            res.status(500).json({ message: error.message });
        }
    },

    addFlavor: async (req, res) => {
        try {
            const { name, isNormal, isTier, price } = req.body;
            const user = req.user;

            // Determine Owner ID
            let ownerId = null;
            if (user.role === 'Dueño') {
                ownerId = user.id;
            } else if (user.ownerId) {
                ownerId = user.ownerId; // Employees create for their boss
            } else if (user.role === 'Administrador') {
                // Admins can create Global items (ownerId = null)
                ownerId = null;
            } else {
                return res.status(403).json({ message: "No tienes permiso para crear sabores." });
            }

            const newFlavor = await Flavor.create({
                name,
                isNormal: isNormal || false,
                isTier: isTier || false,
                price: price || 0,
                ownerId: ownerId,
                available: true
            });
            res.json(newFlavor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateFlavor: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, isNormal, isTier, price, available } = req.body;
            const user = req.user;

            const flavor = await Flavor.findByPk(id);
            if (!flavor) return res.status(404).json({ message: "Sabor no encontrado" });

            // Security: Same as delete
            const isGlobal = flavor.ownerId === null;
            const isMyItem = user.role === 'Dueño' && flavor.ownerId === user.id;

            if (isGlobal && user.role !== 'Administrador') {
                return res.status(403).json({ message: "No puedes editar ítems globales." });
            }
            if (!isGlobal && !isMyItem && user.role !== 'Administrador') {
                return res.status(403).json({ message: "No puedes editar este sabor." });
            }

            await flavor.update({
                name: name !== undefined ? name : flavor.name,
                isNormal: isNormal !== undefined ? isNormal : flavor.isNormal,
                isTier: isTier !== undefined ? isTier : flavor.isTier,
                price: price !== undefined ? price : flavor.price,
                available: available !== undefined ? available : flavor.available
            });

            res.json(flavor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteFlavor: async (req, res) => {
        try {
            const { id } = req.params;
            const user = req.user;

            const flavor = await Flavor.findByPk(id);
            if (!flavor) return res.status(404).json({ message: "Sabor no encontrado" });

            // Security Check: Can only delete if you own it
            // Admin can delete anything? Maybe.
            // Global items (ownerId: null) can only be deleted by Admin.

            const isGlobal = flavor.ownerId === null;
            const isMyItem = user.role === 'Dueño' && flavor.ownerId === user.id;
            const isMyBossItem = user.ownerId && flavor.ownerId === user.ownerId; // Employees usually shouldn't delete, but let's allow if authorized (middleware handles role)

            if (isGlobal && user.role !== 'Administrador') {
                return res.status(403).json({ message: "No puedes eliminar ítems globales del sistema." });
            }

            if (!isGlobal && !isMyItem && user.role !== 'Administrador') { // Simplify checks
                return res.status(403).json({ message: "No puedes eliminar este sabor." });
            }

            await flavor.destroy();
            res.json({ message: 'Sabor eliminado' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // --- FILLINGS ---
    getFillings: async (req, res) => {
        try {
            const user = req.user;
            let whereClause = {};

            if (user) {
                const rootOwnerId = user.role === 'Dueño' ? user.id : user.ownerId;
                if (rootOwnerId) {
                    whereClause = {
                        [Op.or]: [
                            { ownerId: null },
                            { ownerId: rootOwnerId }
                        ]
                    };
                } else {
                    whereClause = { ownerId: null };
                }
            } else {
                whereClause = { ownerId: null };
            }

            if (req.query.onlyAvailable === 'true') {
                whereClause.available = true;
            }

            const fillings = await Filling.findAll({
                where: whereClause,
                order: [['name', 'ASC']]
            });
            res.json(fillings);
        } catch (error) {
            console.error("Error getting fillings:", error);
            res.status(500).json({ message: error.message });
        }
    },

    addFilling: async (req, res) => {
        try {
            const { name, isPaid, suboptions, price } = req.body;
            const user = req.user;

            let ownerId = null;
            if (user.role === 'Dueño') ownerId = user.id;
            else if (user.ownerId) ownerId = user.ownerId;
            else if (user.role === 'Administrador') ownerId = null;
            else return res.status(403).json({ message: "No tienes permiso." });

            // Parse suboptions
            let parsedSubs = suboptions;
            if (typeof suboptions === 'string') {
                parsedSubs = suboptions.split(',').map(s => s.trim()).filter(s => s);
            }

            const newFilling = await Filling.create({
                name,
                isPaid: isPaid || false,
                suboptions: parsedSubs || [],
                price: price || 0,
                ownerId: ownerId,
                available: true
            });
            res.json(newFilling);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateFilling: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, isPaid, suboptions, price, available } = req.body;
            const user = req.user;

            const filling = await Filling.findByPk(id);
            if (!filling) return res.status(404).json({ message: "Relleno no encontrado" });

            const isGlobal = filling.ownerId === null;
            const isMyItem = user.role === 'Dueño' && filling.ownerId === user.id;

            if (isGlobal && user.role !== 'Administrador') return res.status(403).json({ message: "No permitido en globales." });
            if (!isGlobal && !isMyItem && user.role !== 'Administrador') return res.status(403).json({ message: "No permitido." });

            // Parse suboptions
            let parsedSubs = suboptions;
            if (typeof suboptions === 'string') {
                parsedSubs = suboptions.split(',').map(s => s.trim()).filter(s => s);
            }

            await filling.update({
                name: name !== undefined ? name : filling.name,
                isPaid: isPaid !== undefined ? isPaid : filling.isPaid,
                suboptions: parsedSubs !== undefined ? parsedSubs : filling.suboptions,
                price: price !== undefined ? price : filling.price,
                available: available !== undefined ? available : filling.available
            });
            res.json(filling);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteFilling: async (req, res) => {
        try {
            const { id } = req.params;
            const user = req.user;

            const filling = await Filling.findByPk(id);
            if (!filling) return res.status(404).json({ message: "Relleno no encontrado" });

            const isGlobal = filling.ownerId === null;
            const isMyItem = (user.role === 'Dueño' && filling.ownerId === user.id) || (user.ownerId && filling.ownerId === user.ownerId);

            if (isGlobal && user.role !== 'Administrador') {
                return res.status(403).json({ message: "No puedes eliminar ítems globales." });
            }
            if (!isGlobal && !isMyItem && user.role !== 'Administrador') {
                return res.status(403).json({ message: "No tienes permiso para eliminar este relleno." });
            }

            await filling.destroy();
            res.json({ message: 'Relleno eliminado' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = ingredientController;
