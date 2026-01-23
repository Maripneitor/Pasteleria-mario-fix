export const groupOrdersByDate = (orders, days = 7) => {
    if (!orders || orders.length === 0) return [];

    const grouped = {};
    const today = new Date();
    const result = [];

    // Initialize last 'days' days with 0
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toLocaleDateString('es-ES', { weekday: 'short' }); // Lun, Mar
        const key = d.toLocaleDateString('en-CA'); // YYYY-MM-DD for matching
        grouped[key] = { name: dateStr.charAt(0).toUpperCase() + dateStr.slice(1), sales: 0 };
        result.push(grouped[key]); // Reference to object in map
    }

    // Sum sales
    orders.forEach(order => {
        // Assuming deliveryDate is YYYY-MM-DD or comparable
        // If deliveryDate is ISO string, slice it. 
        // Adapting to whatever format deliveryDate comes in, robust parsing needed.
        let dateKey = order.deliveryDate;
        if (dateKey) {
            // Basic normalization if needed. Assuming order.deliveryDate is roughly YYYY-MM-DD
            const orderDate = new Date(dateKey);
            if (!isNaN(orderDate)) {
                const isoDate = orderDate.toLocaleDateString('en-CA');
                // Only count if it's within our initialized range (this is a simplified match)
                // A better approach might be to match against the initialized keys
                if (grouped[isoDate]) {
                    grouped[isoDate].sales += (parseFloat(order.total) || 0);
                }
            }
        }
    });

    return result;
};

export const calculateFlavorStats = (orders) => {
    if (!orders || orders.length === 0) return [];

    // Normalize and count flavors
    const flavorCounts = {};
    orders.forEach(order => {
        // CakeFlavor might be a string or JSON array string depending on backend
        let flavors = [];
        try {
            if (Array.isArray(order.cakeFlavor)) {
                flavors = order.cakeFlavor;
            } else if (typeof order.cakeFlavor === 'string') {
                if (order.cakeFlavor.startsWith('[')) {
                    flavors = JSON.parse(order.cakeFlavor);
                } else {
                    flavors = [order.cakeFlavor];
                }
            }
        } catch (_e) {
            flavors = [order.cakeFlavor];
        }

        flavors.forEach(f => {
            const flavorName = f.trim() || 'Desconocido';
            flavorCounts[flavorName] = (flavorCounts[flavorName] || 0) + 1;
        });
    });

    // Convert to chart format
    return Object.keys(flavorCounts)
        .map(key => ({ name: key, value: flavorCounts[key] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5
};

export const calculateKPIData = (orders) => {
    const totalRevenue = orders.reduce((acc, order) => acc + (parseFloat(order.total) || 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'Entregado' && o.status !== 'Cancelado').length;
    const completedOrders = orders.filter(o => o.status === 'Entregado').length;
    const pendingOrders = orders.filter(o => o.status === 'Pendiente').length;

    // TODO: Calculate trends vs previous period if historical data available

    return {
        revenue: totalRevenue,
        activeCount: activeOrders,
        completedCount: completedOrders,
        pendingCount: pendingOrders
    };
};
