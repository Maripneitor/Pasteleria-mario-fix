import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Card } from './Card';
import BakeryButton from './BakeryButton';
import FocusTrap from './FocusTrap';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger', // 'danger' | 'warning' | 'info'
    isLoading = false
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-title"
                    aria-describedby="confirm-desc"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-sm"
                    >
                        <FocusTrap isActive={isOpen}>
                            <Card glass className="p-6 relative border-l-4 border-status-danger">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                                    aria-label="Cerrar"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 id="confirm-title" className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {title}
                                        </h3>
                                        <p id="confirm-desc" className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                            {message}
                                        </p>

                                        <div className="flex justify-end gap-3">
                                            <BakeryButton
                                                variant="ghost"
                                                onClick={onClose}
                                                disabled={isLoading}
                                            >
                                                {cancelText}
                                            </BakeryButton>
                                            <BakeryButton
                                                variant={variant === 'danger' ? 'danger' : 'solid'}
                                                onClick={onConfirm}
                                                isLoading={isLoading}
                                                autoFocus
                                            >
                                                {confirmText}
                                            </BakeryButton>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </FocusTrap>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
