import React from 'react';

const TechScrollContainer = ({ children, className = '' }) => {
    return (
        <div className={`relative p-8 rounded-xl shadow-2xl overflow-hidden ${className}`}
            style={{ backgroundColor: '#0D0208' }} // Darker background
        >
            {/* 1. Rustic/Paper Base Texture - Dark parchment */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
            {/* 2. Grid/Matrix overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 255, 70, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 70, 0.1) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* 3. Scanline effect */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-green-900/5 to-transparent bg-[length:100%_4px] animate-scan"
                style={{ backgroundSize: '100% 4px' }}
            />

            {/* Content */}
            <div className="relative z-20 font-mono text-green-400">
                {children}
            </div>

            {/* Border glow */}
            <div className="absolute inset-0 border border-green-500/30 rounded-xl pointer-events-none z-20 box-border shadow-[0_0_15px_rgba(0,255,0,0.1)]" />
        </div>
    );
};

export default TechScrollContainer;
