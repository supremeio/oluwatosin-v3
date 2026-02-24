'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function InteractiveDotBackground() {
    const [mounted, setMounted] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the mouse movement slightly for a more "antigravity" fluid feel
    const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

    const xOffset = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [20, -20]);
    const yOffset = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [20, -20]);

    useEffect(() => {
        setMounted(true);

        // Set initial position to center of screen before mouse moves
        mouseX.set(window.innerWidth / 2);
        mouseY.set(window.innerHeight / 2);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
            {/* 
        We use the user's specific SVG as a mask. 
        Where the SVG has content (the dots), the background div below will show through.
      */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                {/* We use motion.div here so we can animate the CSS mask position */}
                <motion.div
                    className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] bg-[#000000] opacity-80"
                    style={{
                        maskImage: `url('/Dot pattern.svg')`,
                        WebkitMaskImage: `url('/Dot pattern.svg')`,
                        maskSize: '1432px 1007px', // Match the viewport size of the original SVG precisely
                        WebkitMaskSize: '1432px 1007px',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        // Create a parallax effect by adjusting the mask position inversely to the mouse position
                        // We use the smoothed mouse values so the background glides smoothly
                        x: xOffset,
                        y: yOffset,
                        maskPosition: 'top 40px left 50%',
                        WebkitMaskPosition: 'top 40px left 50%',
                    }}
                />


            </div>
        </div>
    );
}
