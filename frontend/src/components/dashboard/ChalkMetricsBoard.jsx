import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import ChalkboardContainer from './ChalkboardContainer';
import BakerRanking from './BakerRanking';

// --- Chalk Counter Component ---
const ChalkCounter = ({ value, label, prefix = '' }) => {
    const spring = useSpring(0, { bounce: 0, duration: 2000 });
    const displayValue = useTransform(spring, (current) =>
        prefix + Math.round(current).toLocaleString()
    );

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return (
        <div className="flex flex-col items-center">
            <h4 className="text-gray-300 text-sm tracking-widest uppercase mb-1 font-sans opacity-80">{label}</h4>
            <motion.div className="text-4xl md:text-5xl font-bold font-sketch text-white relative">
                <motion.span>{displayValue}</motion.span>
                {/* Chalk Dust Effect */}
                <div className="absolute inset-0 blur-sm opacity-50 select-none pointer-events-none text-white">
                    <motion.span>{displayValue}</motion.span>
                </div>
            </motion.div>
        </div>
    );
};

// --- Chalk Metrics Board ---
const ChalkMetricsBoard = ({ salesData, financials, bakers }) => {
    // Default empty if loading or error
    const data = salesData || [];
    // financials: { expected, collected, pending }
    const { expected = 0, collected = 0, pending = 0 } = financials || {};

    // Calculate productivity or percentage collected
    const collectionRate = expected > 0 ? Math.round((collected / expected) * 100) : 0;

    // Updated colors for better visibility on chocolate background
    const colors = ['#FDF8F1', '#E6E6FA', '#FDF8F1', '#E6E6FA', '#FDF8F1', '#E6E6FA', '#FDF8F1'];

    return (
        <ChalkboardContainer className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Financials & Summary */}
                <div className="lg:col-span-3 flex flex-col justify-center space-y-8 border-r-2 border-dashed border-white/20 pr-4">
                    <ChalkCounter value={pending} label="Por Cobrar" prefix="$" />
                    <ChalkCounter value={collected} label="Cobrado" prefix="$" />

                    <div className="text-center pt-4">
                        <div className="inline-block border-2 border-white/30 rounded-full px-4 py-1 text-sm text-white/70 font-sketch rotate-[-2deg]">
                            Recaudación: <span className={`${collectionRate > 80 ? 'text-green-300' : 'text-yellow-300'} font-bold`}>{collectionRate}%</span>
                        </div>
                    </div>
                </div>

                {/* Middle Column: Weekly Sales Chart */}
                <div className="lg:col-span-6 h-[350px] flex flex-col px-4 border-r-0 lg:border-r-2 border-dashed border-white/20">
                    <h3 className="text-center text-xl font-bold mb-6 font-sketch text-white/90 underline decoration-wavy decoration-white/30 underline-offset-4">
                        Ventas Semanales
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                            <XAxis
                                dataKey="name" // Day names
                                stroke="#FDF8F1"
                                tick={{ fill: '#FDF8F1', fontFamily: 'Cabin Sketch', fontSize: 16, fontWeight: 'bold' }}
                                tickLine={false}
                                axisLine={{ stroke: '#FDF8F1', strokeWidth: 2, opacity: 0.6 }}
                                interval={0} // Show all days
                            />
                            <YAxis hide />
                            <Bar dataKey="ventas" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1500} animationBegin={300}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index % 2 === 0 ? '#FDF8F1' : '#E6E6FA'} // Cream and Chalk White
                                        stroke="white"
                                        strokeWidth={1}
                                        fillOpacity={0.9}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-center text-xs text-white/60 font-sans mt-2">Ingresos por día (Esta semana)</p>
                </div>

                {/* Right Column: Baker Ranking */}
                <div className="lg:col-span-3 pl-4">
                    <div className="h-full flex flex-col">
                        {/* We use React.lazy or import for BakerRanking if it was huge, but here we can just assume it's passed or imported. 
                            Since I am inside ChalkMetricsBoard, I need to Import BakerRanking at top or use it if I can.
                            I will just put the import at the top in a separate edit or assume it's available. 
                            Wait, I can't easily add import with replace_file_content safely without messing top.
                            I will use multi_replace for this file to add import and change body.
                        */}
                        <div className="flex-1 w-full">
                            {/* Placeholder for BakerRanking if I can't import it easily right now, but I WILL import it. */}
                            {/* See below for multi_replace strategy */}
                            <BakerRanking bakers={bakers} />
                        </div>
                    </div>
                </div>
            </div>
        </ChalkboardContainer>
    );
};

export default ChalkMetricsBoard;
