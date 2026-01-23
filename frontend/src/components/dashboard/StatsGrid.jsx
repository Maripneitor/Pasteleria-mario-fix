import React from 'react';
import HeroCard from './HeroCard';
import { motion } from 'framer-motion';

const StatsGrid = ({ stats }) => {
    // If we want to animate the numbers ("Counter"), we can handle it inside HeroCard
    // or wrap HeroCard to provide the animated value.
    // For simpler implementation, existing HeroCard can be used, and this Grid handles layout.
    // To add "Counter" animation: modifying HeroCard would be cleanest, but user asked for StatsGrid layout.
    // Let's pass the animated value logic inside HeroCard?
    // Actually, `HeroCard` takes a `value`. We could format it.

    // For now, focusing on the layout structure requested: 1 col mobile, 4 desktop.

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemAnimation = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {stats.map((stat, index) => (
                <motion.div key={index} variants={itemAnimation}>
                    <HeroCard
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        trend={stat.trend}
                        trendValue={stat.trendValue}
                        data={stat.data}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default StatsGrid;
