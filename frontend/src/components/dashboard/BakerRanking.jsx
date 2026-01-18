import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';
import IncentiveCard from './IncentiveCard';

const BakerRanking = ({ bakers }) => {
    const sortedBakers = [...(bakers || [])].sort((a, b) => b.folios - a.folios);
    const top3 = sortedBakers.slice(0, 3);
    const winner = top3[0];

    return (
        <div className="flex flex-col h-full bg-black/10 rounded-xl p-4">
            <h3 className="text-center text-xl font-bold mb-6 font-sketch text-white/90 underline decoration-wavy decoration-white/30 underline-offset-4">
                Pastelero del Mes
            </h3>

            {top3.length === 0 ? (
                <div className="text-center text-white/50 font-sketch mt-10">No hay datos suficientes aún.</div>
            ) : (
                <>
                    {/* Podium Area */}
                    <div className="flex items-end justify-center w-full gap-2 md:gap-4 mb-6 sticky top-0">
                        {/* 2nd Place */}
                        {top3[1] && (
                            <div className="flex flex-col items-center opacity-80 scale-90 origin-bottom">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: '70px' }}
                                    className="w-16 bg-gray-400/20 border-2 border-dashed border-gray-400/50 rounded-t-lg flex flex-col justify-end items-center p-2 relative"
                                >
                                    <div className="text-xl font-sketch text-gray-300">2</div>
                                </motion.div>
                                <span className="text-white/80 font-sketch text-xs mt-1 max-w-[80px] truncate">{top3[1].name}</span>
                            </div>
                        )}

                        {/* 1st Place */}
                        {top3[0] && (
                            <div className="flex flex-col items-center">
                                <div className="text-yellow-400 text-2xl mb-1 animate-bounce">👑</div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: '100px' }}
                                    className="w-24 bg-yellow-500/20 border-2 border-dashed border-yellow-500/50 rounded-t-lg flex flex-col justify-end items-center p-2 relative shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                                >
                                    <div className="text-4xl font-sketch text-yellow-300 font-bold">1</div>
                                </motion.div>
                                <span className="text-yellow-200 font-sketch text-sm mt-2 font-bold max-w-[100px] truncate">{top3[0].name}</span>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-white/60 text-xs flex items-center gap-0.5" title="Folios">
                                        📦 {top3[0].folios}
                                    </span>
                                    <span className="text-green-300/80 text-xs flex items-center gap-0.5" title="Sin Errores">
                                        ✨ {top3[0].perfectRate}%
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {top3[2] && (
                            <div className="flex flex-col items-center opacity-80 scale-90 origin-bottom">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: '50px' }}
                                    className="w-16 bg-orange-700/20 border-2 border-dashed border-orange-700/50 rounded-t-lg flex flex-col justify-end items-center p-2 relative"
                                >
                                    <div className="text-xl font-sketch text-orange-400">3</div>
                                </motion.div>
                                <span className="text-white/80 font-sketch text-xs mt-1 max-w-[80px] truncate">{top3[2].name}</span>
                            </div>
                        )}
                    </div>

                    {/* Extended Stats List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent max-h-[200px]">
                        {sortedBakers.map((baker, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-sketch text-white/40 w-4">{idx + 1}.</span>
                                    <span className="text-white/80">{baker.name}</span>
                                </div>
                                <div className="flex gap-3 text-right">
                                    <div className="flex flex-col items-end w-12">
                                        <span className="text-white/30 text-[10px]">Tiempo</span>
                                        <span className={`text-xs ${baker.avgTime < 24 ? 'text-green-300' : 'text-white/60'}`}>
                                            {baker.avgTime}h
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end w-12">
                                        <span className="text-white/30 text-[10px]">Calidad</span>
                                        <span className={`text-xs ${baker.perfectRate > 90 ? 'text-yellow-300' : 'text-white/60'}`}>
                                            {baker.perfectRate}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Incentive Card (Visible to Owner, Developer... and hypothetically the winner if we showed them) */}
                    {/* Assuming this dashboard is Owner View, so always show */}
                    {winner && (
                        <div className="mt-auto pt-4">
                            <IncentiveCard baker={winner} rank={1} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BakerRanking;
