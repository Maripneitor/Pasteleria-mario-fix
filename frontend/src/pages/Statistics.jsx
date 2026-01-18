import React from 'react';
import { BarChart, TrendingUp, DollarSign, Award } from 'lucide-react';
import { mockStatistics } from '../utils/mockData';

const Statistics = () => {
    return (
        <div className="p-6 bg-bakery-cream min-h-screen">
            <h1 className="text-3xl font-serif font-bold text-bakery-text mb-8 flex items-center gap-3">
                <BarChart className="text-bakery-accent" />
                Estadísticas de Venta
            </h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Venta Mensual</p>
                        <h3 className="text-3xl font-bold text-gray-800">${mockStatistics.revenue.monthly.toLocaleString()}</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <DollarSign size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Crecimiento</p>
                        <h3 className="text-3xl font-bold text-green-600">+{mockStatistics.revenue.growth}%</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Producto Top</p>
                        <h3 className="text-xl font-bold text-gray-800">{mockStatistics.topFlavors[0].name}</h3>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                        <Award size={24} />
                    </div>
                </div>
            </div>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Flavors */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Sabores Más Vendidos</h3>
                    <div className="space-y-4">
                        {mockStatistics.topFlavors.map((flavor, index) => (
                            <div key={index} className="relative">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{flavor.name}</span>
                                    <span className="text-gray-500">{flavor.count} ventas</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${(flavor.count / 150) * 100}%`, backgroundColor: flavor.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Simulated Chart Placeholder */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 w-full text-left">Tendencia Semanal</h3>
                    <div className="flex items-end gap-2 h-48 w-full mt-4">
                        {mockStatistics.ordersTrend.map((val, i) => (
                            <div key={i} className="flex-1 bg-bakery-accent/20 rounded-t-lg hover:bg-bakery-accent/40 transition-colors relative group" style={{ height: `${val}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {val}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between w-full mt-2 text-xs text-gray-400">
                        <span>Lunes</span>
                        <span>Domingo</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
