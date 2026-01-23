import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ status, title, folios = [], color }) => {
    const safeFolios = Array.isArray(folios) ? folios : [];
    const filteredFolios = safeFolios.filter(f => f.status === status);

    return (
        <Droppable droppableId={status}>
            {(provided, snapshot) => (
                <div
                    className="flex flex-col h-full min-w-[300px] w-80 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden flex-shrink-0"
                >
                    {/* Header */}
                    <div className={`p-3 border-b border-gray-200 dark:border-slate-700 ${color.replace('bg-', 'bg-')} bg-opacity-10 dark:bg-opacity-20 backdrop-blur-md`}>
                        <div className="flex justify-between items-center">
                            <h3 className={`font-bold text-gray-800 dark:text-white flex items-center gap-2`}>
                                <div className={`w-3 h-3 rounded-full ${color.replace('bg-', 'bg-').replace('bg-opacity-10', '')}`}></div>
                                {title}
                            </h3>
                            <span className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300">
                                {filteredFolios.length}
                            </span>
                        </div>
                    </div>

                    {/* Cards Scroll Area */}
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-3 
                        ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-gray-50/50 dark:bg-slate-900/50'} 
                        transition-colors duration-200`}
                    >
                        {filteredFolios.map((folio, index) => (
                            <KanbanCard
                                key={folio.id}
                                folio={folio}
                                index={index} // Pass index for Draggable
                                activeColor={color.replace('bg-opacity-10', '')}
                            />
                        ))}
                        {provided.placeholder}

                        {filteredFolios.length === 0 && !snapshot.isDraggingOver && (
                            <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm italic">
                                Vacío
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Droppable>
    );
};

export default KanbanColumn;
