import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const IncentiveCard = ({ baker, rank }) => {
    // Only calculate for #1
    if (rank !== 1) return null;

    // Calculate Bonus Suggestion
    // Base: $10 per cake
    // Multiplier: 1.2x if Perfect Rate > 90%
    // Multiplier: 1.1x if Avg Time < 24h
    let bonus = baker.folios * 10;
    if (baker.perfectRate > 90) bonus *= 1.2;
    if (baker.avgTime < 24) bonus *= 1.1;

    // Confetti effect on mount
    React.useEffect(() => {
        const end = Date.now() + 1000;
        const colors = ['#D4A373', '#FDF8F1', '#3E2723'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-lg p-4 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <DollarSign size={64} />
            </div>

            <h4 className="font-sketch text-yellow-300 text-lg mb-2 flex items-center gap-2">
                <span>🏆</span> Bono Sugerido
            </h4>

            <div className="flex justify-between items-end">
                <div>
                    <p className="text-white/70 text-sm font-sans">
                        Basado en rendimiento excepcional:
                    </p>
                    <ul className="text-xs text-white/50 mt-1 space-y-1">
                        {baker.perfectRate > 90 && (
                            <li className="flex items-center gap-1 text-green-300">
                                <CheckCircle size={10} /> +20% Calidad Perfecta
                            </li>
                        )}
                        {baker.avgTime < 24 && (
                            <li className="flex items-center gap-1 text-blue-300">
                                <Clock size={10} /> +10% Velocidad Flash
                            </li>
                        )}
                    </ul>
                </div>
                <div className="text-3xl font-bold font-sketch text-white text-shadow-glow">
                    ${Math.round(bonus)}
                </div>
            </div>
        </motion.div>
    );
};

export default IncentiveCard;
