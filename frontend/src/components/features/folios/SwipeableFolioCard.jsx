import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Check, PenTool } from 'lucide-react';
import FolioCard from './FolioCard';

const SwipeableFolioCard = ({ folio, onDeliver, onSign }) => {
    const x = useMotionValue(0);
    const controls = useAnimation();
    const cardRef = useRef(null);
    const [constrained, setConstrained] = useState(true);

    // Transform values for icons opacity/scale based on drag distance
    const leftIconOpacity = useTransform(x, [50, 100], [0, 1]);
    const leftIconScale = useTransform(x, [50, 100], [0.8, 1.2]);

    const rightIconOpacity = useTransform(x, [-50, -100], [0, 1]);
    const rightIconScale = useTransform(x, [-50, -100], [0.8, 1.2]);

    // Backend colors for indicators
    const leftColor = useTransform(x, [0, 100], ['rgba(204, 213, 174, 0)', 'rgba(204, 213, 174, 1)']); // Mint (Success)
    const rightColor = useTransform(x, [0, -100], ['rgba(147, 197, 253, 0)', 'rgba(147, 197, 253, 1)']); // Blue (Sign)

    const handleDragEnd = async (event, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Swipe Right (Deliver)
        if (offset > 100 || (offset > 50 && velocity > 500)) {
            if (folio.status !== 'Listo para Entrega' && folio.status !== 'Entregado' && folio.status !== 'Cancelado') {
                await onDeliver(folio);
            }
            controls.start({ x: 0 });
        }
        // Swipe Left (Sign)
        else if (offset < -100 || (offset < -50 && velocity < -500)) {
            if (folio.status === 'Listo para Entrega') { // Only sign if ready
                await onSign(folio);
            }
            controls.start({ x: 0 });
        } else {
            // Snap back
            controls.start({ x: 0 });
        }
    };

    return (
        <div className="relative w-full h-full">
            {/* Background Indicators layer */}
            <div className="absolute inset-0 rounded-xl overflow-hidden flex justify-between items-center px-6 z-0 pointer-events-none">
                {/* Left Indicator (Swipe Right -> Deliver) */}
                <motion.div
                    style={{ opacity: leftIconOpacity, scale: leftIconScale }}
                    className="flex flex-col items-center justify-center text-bakery-success font-bold"
                >
                    <div className="bg-bakery-success p-3 rounded-full text-white shadow-sm mb-1">
                        <Check size={24} strokeWidth={3} />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-green-700">Listo</span>
                </motion.div>

                {/* Right Indicator (Swipe Left -> Sign) */}
                <motion.div
                    style={{ opacity: rightIconOpacity, scale: rightIconScale }}
                    className="flex flex-col items-center justify-center text-blue-500 font-bold"
                >
                    <div className="bg-blue-500 p-3 rounded-full text-white shadow-sm mb-1">
                        <PenTool size={24} strokeWidth={3} />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-blue-700">Firmar</span>
                </motion.div>
            </div>

            {/* Background Color Fills */}
            <motion.div style={{ backgroundColor: leftColor }} className="absolute inset-y-0 left-0 w-1/2 rounded-l-xl z-0 pointer-events-none" />
            <motion.div style={{ backgroundColor: rightColor }} className="absolute inset-y-0 right-0 w-1/2 rounded-r-xl z-0 pointer-events-none" />


            {/* Draggable Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }} /* We snap back always, so 0 constraints, but motion allows 'overdrag' */
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                controls={controls}
                style={{ x }}
                className="relative z-10 w-full h-full touch-pan-y"
            >
                <FolioCard folio={folio} />
            </motion.div>
        </div>
    );
};

export default SwipeableFolioCard;
