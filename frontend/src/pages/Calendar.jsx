import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';
import FolioDetailsModal from '../components/FolioDetailsModal';

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFolio, setSelectedFolio] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchFolios();
    }, []);

    const fetchFolios = async () => {
        try {
            const response = await api.get('/folios');
            const folios = Array.isArray(response.data) ? response.data : [];

            const calendarEvents = folios.map(folio => {
                // Determine color based on status
                let color = '#3b82f6'; // Blue default
                if (folio.status === 'Entregado') color = '#10b981'; // Green
                if (folio.status === 'Pendiente') color = '#f59e0b'; // Amber
                if (folio.status === 'Cancelado') color = '#ef4444'; // Red

                return {
                    id: folio.id,
                    title: `#${folio.folioNumber} - ${folio.client?.name || 'Cliente'}`,
                    start: `${folio.deliveryDate}T${folio.deliveryTime}`,
                    backgroundColor: color,
                    borderColor: color,
                    extendedProps: { folio } // Store full object
                };
            });

            setEvents(calendarEvents);
            setLoading(false);
        } catch (error) {
            console.error("Error loading calendar events:", error);
            setLoading(false);
        }
    };

    const handleEventClick = (info) => {
        setSelectedFolio(info.event.extendedProps.folio);
        setIsModalOpen(true);
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-bakery-primary" size={48} />
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 h-[calc(100vh-140px)]">
            <style>{`
                .fc-toolbar-title { font-size: 1.25em !important; font-family: 'DM Serif Display', serif; }
                .fc-button-primary { background-color: #E31C79 !important; border-color: #E31C79 !important; }
                .fc-button-primary:hover { background-color: #C2185B !important; border-color: #C2185B !important; }
                .fc-event { cursor: pointer; border-radius: 4px; padding: 2px; font-size: 0.85em; }
            `}</style>

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                events={events}
                eventClick={handleEventClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                }}
                height="100%"
            />

            <FolioDetailsModal
                folio={selectedFolio}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdate={(updated) => {
                    // Update the specific event in the list locally to avoid refetch
                    setEvents(prev => prev.map(ev =>
                        ev.extendedProps.folio.id === updated.id
                            ? { ...ev, extendedProps: { folio: updated }, title: `#${updated.folioNumber} - ${updated.clientName || updated.client?.name}` }
                            : ev
                    ));
                    setSelectedFolio(updated);
                }}
            />
        </div>
    );
};

export default Calendar;
