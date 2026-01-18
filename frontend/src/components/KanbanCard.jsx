import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';

const KanbanCard = ({ folio, activeColor }) => {
    return (
        <motion.div
            layoutId={folio.id}
            draggable="true"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98, cursor: "grabbing" }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab mb-3 relative overflow-hidden group"
        >
            <div className={`absolute top-0 left-0 w-1 h-full ${activeColor}`}></div>

            <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-800 text-lg">#{folio.folioNumber}</span>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {folio.folioType || 'Normal'}
                </span>
            </div>

            <div className="flex items-center gap-2 mb-2 text-gray-700">
                <User size={14} className="text-gray-400" />
                <span className="text-sm font-medium truncate">{folio.client?.name || 'Cliente Casual'}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{folio.deliveryDate}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{folio.deliveryTime}</span>
                </div>
            </div>

            {folio.cakeFlavor && (
                <div className="text-xs text-gray-600 mb-1 truncate" title={Array.isArray(folio.cakeFlavor) ? folio.cakeFlavor.join(', ') : folio.cakeFlavor}>
                    <span className="font-semibold">Sabor:</span> {Array.isArray(folio.cakeFlavor) ? folio.cakeFlavor[0] : folio.cakeFlavor}
                </div>
            )}

            {folio.filling && (
                <div className="text-xs text-gray-600 truncate" title={Array.isArray(folio.filling) ? folio.filling.map(f => f.name).join(', ') : folio.filling}>
                    <span className="font-semibold">Relleno:</span> {Array.isArray(folio.filling) ? (folio.filling[0]?.name || 'N/A') : folio.filling}
                </div>
            )}

        </motion.div>
    );
};

export default KanbanCard;
