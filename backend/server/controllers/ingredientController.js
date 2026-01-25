const { Flavor, Filling } = require('../models');
const { Op } = require('sequelize');

const ingredientController = {
    // --- SEEDING (Skipped) ---
    seedIngredients: async () => {
        console.log("ℹ️ Seeding logic skipped to preserve dynamic data compatibility.");
    },

    // --- FLAVORS ---
    getFlavors: async (req, res) => {
        try {
            // Contexto de Tenancy (Branch)
            const branchId = req.tenant ? req.tenant.branchId : null;

            if (!branchId) {
                return res.status(400).json({ message: "Contexto de sucursal requerido (X-Branch-ID)." });
            }

            let whereClause = { branchId };

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
            const branchId = req.tenant ? req.tenant.branchId : null;

            if (!branchId) return res.status(400).json({ message: "Contexto de sucursal requerido." });

            const newFlavor = await Flavor.create({
                name,
                isNormal: isNormal || false,
                isTier: isTier || false,
                price: price || 0,
                branchId: branchId,
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
            const branchId = req.tenant ? req.tenant.branchId : null;

            const flavor = await Flavor.findOne({ where: { id, branchId } });
            if (!flavor) return res.status(404).json({ message: "Sabor no encontrado en esta sucursal." });

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
            const branchId = req.tenant ? req.tenant.branchId : null;

            const flavor = await Flavor.findOne({ where: { id, branchId } });
            if (!flavor) return res.status(404).json({ message: "Sabor no encontrado en esta sucursal." });

            await flavor.destroy();
            res.json({ message: 'Sabor eliminado' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // --- FILLINGS ---
    getFillings: async (req, res) => {
        try {
            const branchId = req.tenant ? req.tenant.branchId : null;
            if (!branchId) return res.status(400).json({ message: "Contexto de sucursal requerido." });

            let whereClause = { branchId };

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
            const branchId = req.tenant ? req.tenant.branchId : null;

            if (!branchId) return res.status(400).json({ message: "Contexto de sucursal requerido." });

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
                branchId: branchId,
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
            const branchId = req.tenant ? req.tenant.branchId : null;

            const filling = await Filling.findOne({ where: { id, branchId } });
            if (!filling) return res.status(404).json({ message: "Relleno no encontrado en esta sucursal." });

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
            const branchId = req.tenant ? req.tenant.branchId : null;

            const filling = await Filling.findOne({ where: { id, branchId } });
            if (!filling) return res.status(404).json({ message: "Relleno no encontrado." });

            await filling.destroy();
            res.json({ message: 'Relleno eliminado' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = ingredientController;
