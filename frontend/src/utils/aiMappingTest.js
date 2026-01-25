export const runAiMappingTest = (catalogs) => {
    const mockAiResponse = {
        flavor: "Chocolate Intenso", // Texto impreciso para probar fuzzy
        filling: "Fresa"
    };

    // catalogs: { flavors: [{id: 1, name: 'Vainilla'}, {id: 2, name: 'Chocolate'}, ...], fillings: [...] }
    const { flavors, fillings } = catalogs;

    // Lógica de mapeo (Fuzzy matching simple)
    const mapToId = (text, list) => {
        if (!list || list.length === 0) return null;
        // Normalizar texto de entrada
        const normalizedInput = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const found = list.find(item => {
            const normalizedItem = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            // Simple contains check or first word match
            return normalizedItem.includes(normalizedInput.split(' ')[0]);
        });
        return found ? found.id : null;
    };

    const result = {
        flavorId: mapToId(mockAiResponse.flavor, flavors),
        fillingId: mapToId(mockAiResponse.filling, fillings)
    };

    console.log("[AI TEST] 🧪 Starting Stress Test...");
    console.log("[AI TEST] Input Mock:", mockAiResponse);
    console.log("[AI TEST] Available Flavors:", flavors?.length);
    console.log("[AI TEST] Mapped Result:", result);

    const success = result.flavorId !== null && result.fillingId !== null;

    if (success) {
        console.log("%c[AI TEST] ✅ SUCCESS: Mapped to IDs correctly.", "color: green; font-weight: bold;");
    } else {
        console.log("%c[AI TEST] ❌ FAILED: Could not map one or more items.", "color: red; font-weight: bold;");
    }

    return success;
};
