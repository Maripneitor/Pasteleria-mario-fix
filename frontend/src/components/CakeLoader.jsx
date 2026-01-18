import { motion, AnimatePresence } from 'framer-motion';

const CakeLoader = ({ isLoading }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                when: "beforeChildren"
            }
        },
        exit: { opacity: 0 }
    };

    const layerVariants = {
        hidden: { opacity: 0, scaleY: 0, scaleX: 0.8, y: 20 },
        visible: {
            opacity: 1,
            scaleY: 1,
            scaleX: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 10
            }
        },
        exit: { opacity: 0, scaleY: 0, transition: { duration: 0.2 } }
    };

    const smokeVariants = {
        hidden: { opacity: 0, y: 0 },
        visible: {
            opacity: [0, 1, 0],
            y: -15,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1 // Start after cake built
            }
        }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-bakery-cream/40 backdrop-blur-sm"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                >
                    <motion.div className="relative w-32 h-32 flex flex-col items-center justify-end">
                        {/* SVG Cake */}
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="overflow-visible"
                        >
                            {/* Base Layer */}
                            <motion.g variants={layerVariants} className="origin-bottom">
                                <path
                                    d="M10 80 C10 75 90 75 90 80 V90 C90 95 10 95 10 90 Z"
                                    fill="#FDF8F1"
                                    stroke="#3E2723"
                                    strokeWidth="2"
                                />
                                {/* Detail lines */}
                                <path d="M10 80 Q50 85 90 80" stroke="#3E2723" strokeWidth="1" fill="none" opacity="0.3" />
                            </motion.g>

                            {/* Middle Layer */}
                            <motion.g variants={layerVariants} className="origin-bottom">
                                <path
                                    d="M20 60 C20 55 80 55 80 60 V78 C80 82 20 82 20 78 Z"
                                    fill="#FDF8F1"
                                    stroke="#3E2723"
                                    strokeWidth="2"
                                />
                                {/* Glaze drip detail */}
                                <path d="M20 60 Q30 65 35 60 T50 60 T65 60 T80 60" stroke="#3E2723" strokeWidth="1.5" fill="none" />
                            </motion.g>

                            {/* Top Layer */}
                            <motion.g variants={layerVariants} className="origin-bottom">
                                <path
                                    d="M30 40 C30 35 70 35 70 40 V58 C70 62 30 62 30 58 Z"
                                    fill="#FDF8F1"
                                    stroke="#3E2723"
                                    strokeWidth="2"
                                />
                                {/* Cherry/Decoration on top */}
                                <circle cx="50" cy="35" r="3" fill="#3E2723" />
                            </motion.g>

                            {/* Steam/Smell */}
                            <motion.path
                                d="M45 25 Q50 20 55 25"
                                stroke="#D4A373"
                                strokeWidth="2"
                                fill="none"
                                variants={smokeVariants}
                            />
                            <motion.path
                                d="M50 20 Q55 15 60 20"
                                stroke="#D4A373"
                                strokeWidth="2"
                                fill="none"
                                variants={{ ...smokeVariants, visible: { ...smokeVariants.visible, transition: { ...smokeVariants.visible.transition, delay: 1.2 } } }}
                            />
                        </svg>

                        <motion.span
                            className="mt-4 text-bakery-chocolate font-serif font-medium tracking-wider"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.8 } }}
                        >
                            Horneando...
                        </motion.span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CakeLoader;
