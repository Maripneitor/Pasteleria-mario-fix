import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Sparkles,
    Box,
    DollarSign,
    ShoppingBag,
    CheckCircle,
    Clock
} from 'lucide-react';

const ICON_MAP = {
    'DollarSign': DollarSign,
    'ShoppingBag': ShoppingBag,
    'CheckCircle': CheckCircle,
    'Clock': Clock,
    'Box': Box
};

const HeroCard = ({
    title,
    value,
    icon,
    trend, // 'up' | 'down' | 'neutral'
    trendValue,
    data = [10, 15, 12, 20, 18, 25, 22] // Mock sparkline data
}) => {
    // Dynamic Icon
    const IconComponent = ICON_MAP[icon] || Box;

    // Trend Logic
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const chartColor = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#9ca3af';

    // Sparkle Animation Variants
    const sparkleVariants = {
        rest: { opacity: 0, scale: 0 },
        hover: { opacity: 1, scale: 1, rotate: 180, transition: { duration: 0.5 } }
    };

    return (
        <Card
            glass
            className="relative overflow-hidden group min-h-[160px] flex flex-col justify-between hover:shadow-lg transition-shadow"
        >
            {/* Sparkle Decoration */}
            <motion.div
                variants={sparkleVariants}
                className="absolute top-2 right-2 text-yellow-400"
            >
                <Sparkles size={16} />
            </motion.div>

            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                </div>
                <div className="p-2 bg-bakery-50 dark:bg-bakery-900/50 rounded-full text-bakery-primary">
                    <IconComponent size={24} />
                </div>
            </div>

            {/* Footer / Sparkline */}
            <div className="flex items-end justify-between mt-2">
                <div className="flex items-center gap-1 text-xs font-semibold">
                    <span className={`${trendColor} flex items-center gap-0.5 bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded-md`}>
                        <TrendIcon size={12} />
                        {trendValue}
                    </span>
                    <span className="text-gray-400 font-normal ml-1">vs ayer</span>
                </div>

                <div className="h-10 w-24 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.map((val, i) => ({ val, i }))}>
                            <defs>
                                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="val"
                                stroke={chartColor}
                                strokeWidth={2}
                                fillOpacity={1}
                                fill={`url(#gradient-${title})`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    );
};

export default HeroCard;
