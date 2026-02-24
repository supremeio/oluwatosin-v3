'use client';

import React, { useEffect, useRef } from 'react';
import { useBackground } from '@/providers/BackgroundProvider';

// Configuration
const DOT_SIZE = 1.5;
const DOT_SPACING = 32; // Defines the grid density
const GRID_DOT_COLOR = '#00000020'; // ~12% opacity black
const ACTIVE_DOT_COLOR = '#4169FF'; // Primary blue for active shape
const SHAPE_SCALE = 1.2;

// The shape points represent the `{ }` brackets.
// These are localized around an origin of (0,0) and will be scaled.
const DEV_SHAPE_POINTS = [
    // Left Bracket '{'
    { x: -40, y: -40 }, { x: -30, y: -40 }, { x: -20, y: -40 },
    { x: -50, y: -30 }, { x: -50, y: -20 }, { x: -50, y: -10 },
    { x: -60, y: 0 }, { x: -70, y: 0 },   // The middle point
    { x: -50, y: 10 }, { x: -50, y: 20 }, { x: -50, y: 30 },
    { x: -40, y: 40 }, { x: -30, y: 40 }, { x: -20, y: 40 },

    // Right Bracket '}'
    { x: 40, y: -40 }, { x: 30, y: -40 }, { x: 20, y: -40 },
    { x: 50, y: -30 }, { x: 50, y: -20 }, { x: 50, y: -10 },
    { x: 60, y: 0 }, { x: 70, y: 0 },     // The middle point
    { x: 50, y: 10 }, { x: 50, y: 20 }, { x: 50, y: 30 },
    { x: 40, y: 40 }, { x: 30, y: 40 }, { x: 20, y: 40 },
];

class Particle {
    x: number;
    y: number;
    originX: number;
    originY: number;
    targetX: number;
    targetY: number;
    isShape: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.targetX = x;
        this.targetY = y;
    }

    // Easing function for smooth movement
    update(isHoveringShape: boolean) {
        // If we are forming a shape and this particle is part of it, move to target
        if (isHoveringShape && this.isShape) {
            this.x += (this.targetX - this.x) * 0.1;
            this.y += (this.targetY - this.y) * 0.1;
        }
        // Otherwise, return to origin grid position
        else {
            this.x += (this.originX - this.x) * 0.05;
            this.y += (this.originY - this.y) * 0.05;
        }
    }

    draw(ctx: CanvasRenderingContext2D, isHoveringShape: boolean) {
        // Determine color and opacity based on state
        let color = GRID_DOT_COLOR;
        let radius = DOT_SIZE / 2;

        if (isHoveringShape) {
            if (this.isShape) {
                color = ACTIVE_DOT_COLOR;
                radius = DOT_SIZE; // Make shape dots slightly larger
            } else {
                // Fade out non-shape dots to make the shape pop
                color = '#00000008';
            }
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function CanvasParticleBackground(): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { hoverState } = useBackground();
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);

    // Initialize Canvas and Particles
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle high-DPI displays (retina screens)
        const dpr = window.devicePixelRatio || 1;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            initParticles(width, height);
        };

        const initParticles = (w: number, h: number) => {
            const pArray: Particle[] = [];
            const cols = Math.floor(w / DOT_SPACING) + 2;
            const rows = Math.floor(h / DOT_SPACING) + 2;

            const offsetX = (w - (cols * DOT_SPACING)) / 2;
            const offsetY = (h - (rows * DOT_SPACING)) / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * DOT_SPACING + offsetX;
                    const y = j * DOT_SPACING + offsetY;

                    // Introduce slight random offset to simulate organic pattern
                    const jitterX = (Math.random() - 0.5) * 4;
                    const jitterY = (Math.random() - 0.5) * 4;

                    pArray.push(new Particle(x + jitterX, y + jitterY));
                }
            }
            particlesRef.current = pArray;
            assignShapes(w, h);
        };

        // Map specific grid particles to the target shape points
        const assignShapes = (w: number, h: number) => {
            const centerX = w / 2;
            const centerY = h / 2 - 50; // Offset shape slightly up for balance

            // Shuffle particles so random ones form the shape
            const shuffled = [...particlesRef.current].sort(() => 0.5 - Math.random());

            DEV_SHAPE_POINTS.forEach((point, index) => {
                if (index < shuffled.length) {
                    const p = shuffled[index];
                    p.isShape = true;
                    // Apply scaling and centering
                    p.targetX = centerX + (point.x * SHAPE_SCALE);
                    p.targetY = centerY + (point.y * SHAPE_SCALE);
                }
            });
        };

        window.addEventListener('resize', resize);
        resize();

        // The animation loop
        const animate = () => {
            // Create a slight trailing motion blur effect by drawing semi-transparent rect
            ctx.fillStyle = 'rgba(252, 252, 253, 0.4)'; // Matches bg-bg-main
            ctx.fillRect(0, 0, width, height);

            const isHovering = hoverState === 'developer';

            particlesRef.current.forEach(p => {
                p.update(isHovering);
                p.draw(ctx, isHovering);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [hoverState]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
