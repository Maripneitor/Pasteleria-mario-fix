import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Calendar, User, DollarSign, X } from 'lucide-react';

const Folios = () => {
    const [folios, setFolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        deliveryDate: '',
        deliveryTime: '12:00', // Default time
        cakeFlavor: '', // Now a simple string for simplicity in basic form, can be array later
        filling: '',
        persons: '',
        total: '',
        advancePayment: '0',
        shape: 'Redondo', // Default
        designDescription: 'Pedido estándar' // Default
    });

    useEffect(() => {
        fetchFolios();
    }, []);

    const fetchFolios = async () => {
        try {
            const response = await api.get('/folios');
            setFolios(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar los folios.');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Adapt data for backend structure
            const payload = {
                ...formData,
                // Parse simple strings to arrays/objects if needed by strict backend validation, 
                // but checking controller, it handles strings correctly or we can send arrays.
                // For now sending as is, assuming backend handles single values or we wrap them:
                cakeFlavor: JSON.stringify([formData.cakeFlavor]),
                filling: JSON.stringify([{ name: formData.filling, hasCost: false }]),
                // Ensure numbers are numbers
                persons: parseInt(formData.persons),
                total: parseFloat(formData.total),
                advancePayment: parseFloat(formData.advancePayment),
            };

            await api.post('/folios', payload);
            setShowModal(false);
            setFormData({
                clientName: '', clientPhone: '', deliveryDate: '', deliveryTime: '12:00',
                cakeFlavor: '', filling: '', persons: '', total: '', advancePayment: '0',
                shape: 'Redondo', designDescription: 'Pedido estándar'
            });
            fetchFolios(); // Refresh list
        } catch (err) {
            alert('Error al crear el folio: ' + (err.response?.data?.message || err.message));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Nuevo': return 'bg-blue-100 text-blue-800';
            case 'En Producción': return 'bg-yellow-100 text-yellow-800';
            case 'Listo para Entrega': return 'bg-green-100 text-green-800';
            case 'Entregado': return 'bg-gray-100 text-gray-800';
            case 'Cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Pedido
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Cargando pedidos...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-10">{error}</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">Folio</th>
                                    <th className="p-4 font-semibold text-gray-600">Cliente</th>
                                    <th className="p-4 font-semibold text-gray-600">Entrega</th>
                                    <th className="p-4 font-semibold text-gray-600">Detalles</th>
                                    <th className="p-4 font-semibold text-gray-600">Total / Saldo</th>
                                    <th className="p-4 font-semibold text-gray-600">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {folios.map((folio) => (
                                    <tr key={folio.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">#{folio.folioNumber}</td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{folio.client?.name || 'Cliente Casual'}</div>
                                            <div className="text-sm text-gray-500">{folio.client?.phone}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <Calendar size={16} />
                                                <span>{folio.deliveryDate}</span>
                                            </div>
                                            <div className="text-sm text-gray-500 pl-6">{folio.deliveryTime}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div title={JSON.stringify(folio.cakeFlavor)} className="truncate max-w-xs">
                                                Sabor: {Array.isArray(folio.cakeFlavor) ? folio.cakeFlavor[0] : 'N/A'}
                                            </div>
                                            <div title={JSON.stringify(folio.filling)} className="truncate max-w-xs">
                                                Relleno: {Array.isArray(folio.filling) ? folio.filling[0]?.name : 'N/A'}
                                            </div>
                                            <div>{folio.persons} pax</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">${folio.total}</div>
                                            <div className="text-xs text-red-500 font-medium">Deben: ${folio.balance}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(folio.status)}`}>
                                                {folio.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {folios.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No hay pedidos registrados aún.
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Creación */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Nuevo Pedido</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sección Cliente */}
                            <div className="md:col-span-2 font-semibold text-gray-700 pb-2 border-b">Datos del Cliente</div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Cliente</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    <input
                                        type="text" name="clientName" required
                                        value={formData.clientName} onChange={handleInputChange}
                                        className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="tel" name="clientPhone" required
                                    value={formData.clientPhone} onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Ej. 6671234567"
                                />
                            </div>

                            {/* Sección Entrega */}
                            <div className="md:col-span-2 font-semibold text-gray-700 pb-2 border-b mt-2">Fecha de Entrega</div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                <input
                                    type="date" name="deliveryDate" required
                                    value={formData.deliveryDate} onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                                <input
                                    type="time" name="deliveryTime" required
                                    value={formData.deliveryTime} onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>

                            {/* Sección Detalles Pastel */}
                            <div className="md:col-span-2 font-semibold text-gray-700 pb-2 border-b mt-2">Detalles del Pastel</div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño (Personas)</label>
                                <input
                                    type="number" name="persons" required
                                    value={formData.persons} onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Ej. 20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sabor Pan</label>
                                <input
                                    type="text" name="cakeFlavor" required
                                    value={formData.cakeFlavor} onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Ej. Vainilla"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Relleno</label>
                                <input
                                    type="text" name="filling" required
                                    value={formData.filling} onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Ej. Chocolate"
                                />
                            </div>

                            {/* Sección Pago */}
                            <div className="md:col-span-2 font-semibold text-gray-700 pb-2 border-b mt-2">Pago</div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Costo Total ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    <input
                                        type="number" name="total" required
                                        value={formData.total} onChange={handleInputChange}
                                        className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Anticipo ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    <input
                                        type="number" name="advancePayment" required
                                        value={formData.advancePayment} onChange={handleInputChange}
                                        className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-4 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Guardar Pedido
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Folios;
