export const RECIPES = {
    // Base consumption per PERSON served (approximate units)
    'Chocolate': {
        'Harina': 0.05, // kg
        'Azúcar': 0.04, // kg
        'Huevos': 0.1, // units (approx 2 eggs per 20 ppl, normalized) -> 2/20 = 0.1
        'Chocolate': 0.03, // kg
        'Leche': 0.02 // L
    },
    'Vainilla': {
        'Harina': 0.05,
        'Azúcar': 0.04,
        'Huevos': 0.1,
        'Leche': 0.02,
        'Vainilla': 0.005 // L
    },
    'Tres Leches': {
        'Harina': 0.04,
        'Azúcar': 0.05,
        'Huevos': 0.1,
        'Leche': 0.08, // High milk consumption
        'Crema': 0.03 // L
    },
    'Zanahoria': {
        'Harina': 0.04,
        'Azúcar': 0.03,
        'Huevos': 0.08,
        'Zanahoria': 0.05, // kg
        'Aceite': 0.02 // L
    }
};

// Mock inventory baseline (Real Stock in Warehouse)
export const INVENTORY_BASELINE = [
    { id: 1, name: 'Harina', stock: 50, unit: 'kg', minLevel: 20 },
    { id: 2, name: 'Azúcar', stock: 120, unit: 'kg', minLevel: 15 }, // Plenty
    { id: 3, name: 'Huevos', stock: 200, unit: 'pza', minLevel: 30 },
    { id: 4, name: 'Leche', stock: 20, unit: 'L', minLevel: 10 }, // Low
    { id: 5, name: 'Chocolate', stock: 5, unit: 'kg', minLevel: 5 }, // Critical
    { id: 6, name: 'Vainilla', stock: 2, unit: 'L', minLevel: 1 },
];
