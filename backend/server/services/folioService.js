const { Filling, Flavor } = require('../models');

class FolioService {
    /**
     * Calcula los totales del folio basándose en los parámetros del pastel.
     * @param {Object} data - Datos del cálculo
     * @param {number} data.persons - Número de personas
     * @param {string} data.folioType - 'Normal' | 'Base/Especial'
     * @param {Array<{name: string}>} data.fillings - Lista de rellenos seleccionados
     * @param {number} data.basePrice - Precio base del pastel (sin extras)
     * @param {Array} data.additionalItems - Items adicionales {price: number}
     * @param {number} data.deliveryCost - Costo de envío
     * @param {boolean} data.applyCommission - Si se cobra comisión al cliente
     */
    async calculateFolioTotals({
        persons = 0,
        folioType = 'Normal',
        fillings = [],
        basePrice = 0,
        additionalItems = [],
        deliveryCost = 0,
        applyCommission = false
    }) {
        // 1. Calcular Costo de Rellenos (Dinámico)
        let fillingCost = 0;

        // Si es pastel normal, calculamos costo por bloque de 20 personas
        if (folioType === 'Normal' && persons > 0 && fillings.length > 0) {
            // Obtener nombres de rellenos
            const fillingNames = fillings.map(f => (typeof f === 'string' ? f : f.name));

            // Consultar precios en BD
            const dbFillings = await Filling.findAll({
                where: { name: fillingNames }
            });

            const blocksOf20 = Math.ceil(persons / 20);

            for (const fName of fillingNames) {
                const dbF = dbFillings.find(df => df.name === fName);
                if (dbF && dbF.isPaid) {
                    // Usar precio de BD o fallback a 30 (valor legacy) si es 0/null
                    const price = parseFloat(dbF.price) || 30;
                    fillingCost += price * blocksOf20;
                }
            }
        }

        // 2. Calcular Extras (Adicionales)
        const additionalCost = additionalItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

        // 3. Subtotal
        const subtotal = parseFloat(basePrice) + parseFloat(deliveryCost) + additionalCost + fillingCost;

        // 4. Comisión (5%)
        // Lógica privada encapsulada aquí
        const { commissionAmount, roundedCommission, total } = this._calculateCommission(subtotal, applyCommission);

        // 5. Anticipo Mínimo (Regla de negocio: 50%)
        const anticipoMinimo = Math.ceil(total * 0.5);

        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            fillingCost: parseFloat(fillingCost.toFixed(2)),
            commission: parseFloat(roundedCommission.toFixed(2)),
            rawCommission: parseFloat(commissionAmount.toFixed(2)), // Por si se necesita el valor exacto
            total: parseFloat(total.toFixed(2)),
            anticipoMinimo: parseFloat(anticipoMinimo.toFixed(2))
        };
    }

    /**
     * Método privado para cálculo de comisión
     * @param {number} amount 
     * @param {boolean} applyToCustomer 
     */
    _calculateCommission(amount, applyToCustomer) {
        const commissionRate = 0.05;
        const commissionAmount = amount * commissionRate;
        let roundedCommission = 0;
        let total = amount;

        if (applyToCustomer) {
            // Redondear hacia arriba a la decena más cercana (Ej: 43 -> 50)
            roundedCommission = Math.ceil(commissionAmount / 10) * 10;
            total += roundedCommission;
        }

        return { commissionAmount, roundedCommission, total };
    }
}

module.exports = new FolioService();
