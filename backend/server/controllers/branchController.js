const { Branch } = require('../models');

// OBTENER todas las sucursales
exports.getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.findAll();
        res.json(branches);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener sucursales', error: error.message });
    }
};

// OBTENER configuración de sucursal
exports.getBranch = async (req, res) => {
    try {
        const branchId = req.params.id;
        // Security check: Ensure user belongs to this branch or is Admin (logic typically in middleware, but explicit here for safety)
        // For simplicity assuming middleware handles basic auth.

        const branch = await Branch.findByPk(branchId);
        if (!branch) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }

        res.json(branch);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener sucursal', error: error.message });
    }
};

// ACTUALIZAR configuración de sucursal
exports.updateBranch = async (req, res) => {
    try {
        const branchId = req.params.id;
        const { logoUrl, primaryColor } = req.body;

        const branch = await Branch.findByPk(branchId);
        if (!branch) {
            return res.status(404).json({ message: 'Sucursal no encontrada' });
        }

        // TODO: Validate user permissions (e.g., is Owner of this branch or Admin)
        // Access Control Logic Here...

        await branch.update({
            logoUrl: logoUrl !== undefined ? logoUrl : branch.logoUrl,
            primaryColor: primaryColor !== undefined ? primaryColor : branch.primaryColor
        });

        res.json({ message: 'Personalización actualizada', branch });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar sucursal', error: error.message });
    }
};
