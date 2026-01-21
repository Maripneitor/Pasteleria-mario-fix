import { motion, AnimatePresence } from 'framer-motion';
import Loader from './ui/Loader';

const CakeLoader = ({ isLoading }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                        <Loader size="large" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium animate-pulse">
                            Cargando...
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CakeLoader;
