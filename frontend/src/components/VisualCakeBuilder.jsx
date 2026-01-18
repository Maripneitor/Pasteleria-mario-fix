import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VisualCakeBuilder = ({ tiers = [], shape = 'Redondo' }) => {
    // Sort reverse to stack from bottom (largest index) to top (0), 
    // but usually users add top-tier first? NO, usually bottom tier is first (biggest).
    // Let's assume index 0 is TOP tier for visual stacking if we Render normally? 
    // Actually, cakes are built bottom-up. Let's assume the array order:
    // If user adds: Tier 1, Tier 2... 
    // Often Tier 1 is the top or bottom depending on convention.
    // Visual Stack: Let's render them as a vertical flex column-reverse.
    // So index 0 is at bottom (if we map normally and flex-col-reverse) OR
    // index 0 is top (if we map normally and flex-col).

    // Convention: Usually index 0 = Top Tier? Or Bottom Tier?
    // Let's assume index 0 = Top Tier for list UI, but visually...
    // Let's stick to: Map order = visual order from Top to Bottom?
    // If I have 3 tiers, usually detailed as: Tier 1 (Top), Tier 2 (Middle), Tier 3 (Bottom/Base).
    // So we render them in standard column flex.

    // Helper to determine width percentage based on 'persons' relative to max
    const maxPersons = Math.max(...tiers.map(t => parseInt(t.persons) || 0), 20); // Default max 20 to avoid div/0

    return (
        <div className="flex flex-col items-center justify-end w-full h-full min-h-[300px] p-8 bg-amber-50 rounded-xl border border-amber-100 shadow-inner relative overflow-hidden">
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] pointer-events-none"></div>

            <div className="z-10 flex flex-col items-center gap-1 w-full max-w-[280px]">
                <AnimatePresence>
                    {tiers.map((tier, index) => {
                        const persons = parseInt(tier.persons) || 10;
                        // Calculate width proportional to max persons, 
                        // but keeping a min width (e.g., 40%) so it looks like a cake.
                        const widthPercent = Math.max(40, (persons / maxPersons) * 100);

                        // Simple "Hand-drawn" effect using border-radius
                        const borderRadius = shape === 'Redondo'
                            ? '1rem 1rem 0.5rem 0.5rem'
                            : '0.2rem';

                        const isChocolate = tier.flavor?.toLowerCase().includes('chocolate');
                        const flavorColor = isChocolate ? 'bg-amber-800' : 'bg-orange-100';
                        const borderColor = isChocolate ? 'border-amber-900' : 'border-orange-200';
                        const textColor = isChocolate ? 'text-amber-100' : 'text-amber-800';

                        return (
                            <motion.div
                                key={index} // Ideally use a stable ID if available, using index for now as tiers might not have IDs yet
                                initial={{ opacity: 0, y: -50, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                layout
                                className={`relative flex items-center justify-center ${flavorColor} border-2 ${borderColor} shadow-sm cursor-help transition-colors hover:brightness-95`}
                                style={{
                                    width: `${widthPercent}%`,
                                    height: '60px', // Fixed height for visual consistency
                                    borderRadius: borderRadius,
                                    // Rough edge filter could be SVG, but simple CSS helps performance
                                }}
                                title={`Piso ${index + 1}: ${tier.flavor || 'Sin sabor'} - ${tier.filling || 'Sin relleno'}`}
                            >
                                {/* Decoration Line */}
                                <div className="absolute top-2 w-[90%] border-t border-dashed border-black/10"></div>

                                <span className={`text-xs font-bold ${textColor} z-10`}>
                                    {persons} pax
                                </span>

                                {/* Flavor/Filling Dot Indicators */}
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    {tier.flavor && <div className="w-2 h-2 rounded-full bg-blue-400" title="Sabor definido"></div>}
                                    {tier.filling && <div className="w-2 h-2 rounded-full bg-pink-400" title="Relleno definido"></div>}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {/* Base Plate */}
                <motion.div
                    layout
                    className="w-full h-4 bg-gray-300 rounded-lg mt-1 shadow-md border border-gray-400"
                ></motion.div>

                {tiers.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-amber-800/30 font-bold text-xl uppercase tracking-widest pointer-events-none">
                        Tu Pastel
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualCakeBuilder;
