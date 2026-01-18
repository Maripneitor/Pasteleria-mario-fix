import React from 'react';

const ChalkboardContainer = ({ children, className = '' }) => {
    return (
        <div className={`relative p-8 rounded-xl shadow-2xl bg-[#1A1A1A] overflow-hidden ${className}`}>
            {/* Wood Border Texture (Simulated with CSS) */}
            <div className="absolute inset-0 border-[12px] border-[#3E2723] rounded-xl pointer-events-none z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
                style={{
                    backgroundImage: 'linear-gradient(45deg, #3E2723 25%, #4E342E 25%, #4E342E 50%, #3E2723 50%, #3E2723 75%, #4E342E 75%, #4E342E 100%)',
                    backgroundSize: '20px 20px',
                    opacity: 0.9
                }}
            />

            {/* Inner Chalkboard Texture */}
            <div className="absolute inset-2 bg-[#262626] rounded-lg z-0">
                {/* Noise Filter Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                />
                {/* Smudge/Eraser Marks */}
                <div className="absolute inset-0 opacity-10 bg-white/5 mix-blend-overlay"
                    style={{
                        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.2), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1), transparent 30%)'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 font-[Cabin Sketch] text-white/90">
                {children}
            </div>
        </div>
    );
};

export default ChalkboardContainer;
