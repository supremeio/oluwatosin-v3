'use client';

import { motion } from 'framer-motion';

export function AiGlowingIcon({ className = '' }: { className?: string }) {
    const floatTransition = {
        duration: 3,
        repeat: Infinity,
        repeatType: 'mirror' as const,
        ease: 'easeInOut',
    };

    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-full h-full ${className}`}
        >
            <mask id="siri-mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                <circle cx="16" cy="16" r="16" fill="#D9D9D9" />
            </mask>

            <g mask="url(#siri-mask)">
                <circle cx="16" cy="16" r="16" fill="#000000" />

                <motion.g
                    filter="url(#siri-blur)"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '16px 16px' }}
                >
                    <motion.ellipse
                        opacity="0.8" cx="24.5" cy="13.5" rx="12.5" ry="9.5" fill="#4169FF"
                        initial={{ scale: 1, x: 0, y: 0 }}
                        animate={{ scale: [1, 1.25, 1], x: [0, -6, 0], y: [0, 4, 0] }}
                        transition={{ ...floatTransition, duration: 2.7 }}
                    />
                    <motion.ellipse
                        cx="-2.5" cy="17.5" rx="12.5" ry="9.5" fill="#FF0080"
                        initial={{ scale: 1, x: 0, y: 0 }}
                        animate={{ scale: [1, 1.4, 1], x: [0, 8, 0], y: [0, -5, 0] }}
                        transition={{ ...floatTransition, duration: 3.3 }}
                    />
                    <motion.ellipse
                        cx="-5.5" cy="16.5" rx="9.5" ry="7.5" fill="#000000"
                        initial={{ scale: 1, x: 0, y: 0 }}
                        animate={{ scale: [1, 1.3, 1], x: [0, 7, 0] }}
                        transition={{ ...floatTransition, duration: 3.0 }}
                    />
                    <motion.ellipse
                        cx="7.5" cy="16.5" rx="9.5" ry="7.5" fill="#00EDED"
                        initial={{ scale: 1, x: 0, y: 0 }}
                        animate={{ scale: [1, 1.5, 1], y: [0, -7, 0] }}
                        transition={{ ...floatTransition, duration: 2.4 }}
                    />
                    <motion.ellipse
                        cy="23.5" rx="9" ry="6.5" fill="#FF6600"
                        initial={{ scale: 1, x: 0, y: 0 }}
                        animate={{ scale: [1, 1.6, 1], x: [0, 4, 0], y: [0, -8, 0] }}
                        transition={{ ...floatTransition, duration: 3.1 }}
                    />
                    <motion.ellipse
                        cx="11" cy="25.5" rx="9" ry="6.5" fill="#FFD700"
                        initial={{ scale: 1, x: 0, y: 0 }}
                        animate={{ scale: [1, 1.2, 1], x: [0, 5, 0] }}
                        transition={{ ...floatTransition, duration: 2.8 }}
                    />
                    <motion.ellipse
                        cx="20.5" cy="20" rx="10.5" ry="8" fill="#8A2BE2" fillOpacity="0.94"
                        initial={{ scale: 1, x: 0, y: 0 }}
                        animate={{ scale: [1, 1.3, 1], x: [0, -5, 0], y: [0, -6, 0] }}
                        transition={{ ...floatTransition, duration: 3.4 }}
                    />
                    <motion.ellipse
                        cx="25" cy="19" rx="7" ry="6" fill="#FF1493" fillOpacity="0.94"
                        initial={{ scale: 1, x: 0, y: 0 }}
                        animate={{ scale: [1, 1.4, 1], x: [0, -6, 0] }}
                        transition={{ ...floatTransition, duration: 3.7 }}
                    />
                    <motion.ellipse
                        cx="11.5" cy="7" rx="6.5" ry="4" fill="#8A2BE2"
                        initial={{ scale: 1, x: 0, y: 0 }}
                        animate={{ scale: [1, 1.5, 1], y: [0, 6, 0] }}
                        transition={{ ...floatTransition, duration: 2.2 }}
                    />
                </motion.g>
            </g>

            <defs>
                <filter id="siri-blur" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="4.5" result="effect1_foregroundBlur_705_19939" />
                </filter>
            </defs>
        </svg>
    );
}
