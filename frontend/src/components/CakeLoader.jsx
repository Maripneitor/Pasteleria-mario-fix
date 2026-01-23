import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake } from 'lucide-react';

const CakeLoader = ({ isLoading = true }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bakery-milk/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="relative">
                        <motion.div
                            animate={{
                                y: [-10, 0, -10],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-bakery-primary"
                        >
                            <Cake size={64} />
                        </motion.div>
                        <motion.div
                            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-3 bg-bakery-accent/20 rounded-full blur-sm"
                        />
                    </div>

                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-xl font-medium text-bakery-accent font-sans"
                    >
                        Horneando...
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CakeLoader;
