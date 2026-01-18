/**
 * Sanitizes a Folio object to ensure all required fields have valid values.
 * Prevents UI crashes due to null/undefined values from backend.
 * 
 * @param {Object} folio - The data object from the backend
 * @returns {Object} - A safe-to-render folio object
 */
export const sanitizeFolio = (folio) => {
    if (!folio) return null;

    // Safety checks for nested objects
    const safeClient = folio.client || {};

    return {
        ...folio,
        // Ensure ID string consistency
        id: folio.id,
        folioNumber: folio.folioNumber || 'SIN-FOLIO',

        // Client Data
        client: {
            name: safeClient.name || 'Cliente sin registro',
            phone: safeClient.phone || 'Sin teléfono',
            phone2: safeClient.phone2 || null
        },

        // Financials (Default to string '0.00' for display consistency)
        total: folio.total ?? '0.00',
        advancePayment: folio.advancePayment ?? '0.00',
        balance: folio.balance ?? '0.00',
        deliveryCost: folio.deliveryCost ?? '0.00',

        // Arrays (Ensure they are arrays)
        cakeFlavor: Array.isArray(folio.cakeFlavor)
            ? folio.cakeFlavor
            : (folio.cakeFlavor ? [folio.cakeFlavor] : []),

        filling: Array.isArray(folio.filling)
            ? folio.filling
            : (folio.filling ? [folio.filling] : []),

        tiers: Array.isArray(folio.tiers) ? folio.tiers : [],
        additional: Array.isArray(folio.additional) ? folio.additional : [],

        // Status validity
        status: ['Pendiente', 'Nuevo', 'En Producción', 'Listo para Entrega', 'Entregado', 'Cancelado'].includes(folio.status)
            ? folio.status
            : 'Pendiente',

        // Date/Time
        deliveryDate: folio.deliveryDate || 'Fecha pendiente',
        deliveryTime: folio.deliveryTime || '--:--',

        // Strings
        persons: folio.persons || 0,
        shape: folio.shape || 'N/A'
    };
};

/**
 * Sanitizes an array of folios
 */
export const sanitizeFolioList = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map(sanitizeFolio).filter(item => item !== null);
};
