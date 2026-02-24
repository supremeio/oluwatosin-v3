'use client';

import React, { useEffect, useRef } from 'react';
import { useBackground, HoverState } from '@/providers/BackgroundProvider';

// Configuration
const DOT_SIZE = 1.5;
const DOT_SPACING = 32;
const GRID_DOT_COLOR = '#00000040'; // Slightly more visible black
const ACTIVE_DOT_COLOR = '#4169FF'; // Primary blue
const IDLE_OPACITY = 0.05; // When a shape is forming, other dots fade to this
const SPRING_FACTOR = 0.05;
const FRICTION = 0.85;

class Particle {
    x: number;
    y: number;
    originX: number;
    originY: number;
    targetX: number;
    targetY: number;
    vx: number = 0;
    vy: number = 0;
    isShape: boolean = false;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.targetX = x;
        this.targetY = y;
    }

    update(isHoveringShape: boolean) {
        // Determine where particle should go
        const destX = (isHoveringShape && this.isShape) ? this.targetX : this.originX;
        const destY = (isHoveringShape && this.isShape) ? this.targetY : this.originY;

        // Spring physics for organic "gathering" and "dispersing"
        const dx = destX - this.x;
        const dy = destY - this.y;

        this.vx += dx * SPRING_FACTOR;
        this.vy += dy * SPRING_FACTOR;

        this.vx *= FRICTION;
        this.vy *= FRICTION;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx: CanvasRenderingContext2D, isHoveringShape: boolean) {
        let color = GRID_DOT_COLOR;
        let radius = DOT_SIZE / 2;

        if (isHoveringShape) {
            if (this.isShape) {
                color = ACTIVE_DOT_COLOR;
                radius = DOT_SIZE * 0.8;
            } else {
                color = `rgba(0, 0, 0, ${IDLE_OPACITY})`;
            }
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Generate coordinates by drawing an SVG to an offscreen canvas and scanning pixels
async function getShapeCoordinates(svgString: string, w: number, h: number, DOMURL: typeof window.URL | null, pointDensity: number = 6): Promise<{ x: number, y: number }[]> {
    return new Promise((resolve) => {
        if (!DOMURL) return resolve([]);

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = DOMURL.createObjectURL(svgBlob);

        img.onload = () => {
            const oc = document.createElement('canvas');
            // Scale down inner drawing area so shape isn't massive
            const drawSize = Math.min(w, h) * 0.5;
            oc.width = drawSize;
            oc.height = drawSize;
            const octx = oc.getContext('2d', { willReadFrequently: true });
            if (!octx) return resolve([]);

            // Draw SVG centered
            octx.drawImage(img, 0, 0, drawSize, drawSize);
            const data32 = new Uint32Array(octx.getImageData(0, 0, drawSize, drawSize).data.buffer);

            const coords: { x: number, y: number }[] = [];
            const offsetX = (w - drawSize) / 2;
            const offsetY = (h - drawSize) / 2;

            // Scan image data at intervals matching desired density
            for (let y = 0; y < drawSize; y += pointDensity) {
                for (let x = 0; x < drawSize; x += pointDensity) {
                    const alpha = data32[y * drawSize + x] & 0xff000000;
                    if (alpha !== 0) { // If pixel is not transparent
                        coords.push({
                            x: x + offsetX,
                            y: y + offsetY - 50 // Shift up slightly for layout balance
                        });
                    }
                }
            }

            DOMURL.revokeObjectURL(url);
            resolve(coords);
        };
        img.src = url;
    });
}

// SVG Definitions for the shapes
const DEV_BRACKETS_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M 35 20 Q 20 20 20 35 L 20 45 Q 20 50 10 50 Q 20 50 20 55 L 20 65 Q 20 80 35 80" stroke="black" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M 65 20 Q 80 20 80 35 L 80 45 Q 80 50 90 50 Q 80 50 80 55 L 80 65 Q 80 80 65 80" stroke="black" stroke-width="8" stroke-linecap="round" fill="none"/>
</svg>`;

const ORG_BUILDING_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M 20 80 L 20 40 L 50 20 L 80 40 L 80 80 Z" stroke="black" stroke-width="8" stroke-linejoin="round" fill="none"/>
  <rect x="40" y="60" width="20" height="20" stroke="black" stroke-width="8" fill="none"/>
</svg>`;

export function CanvasParticleBackground(): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { hoverState } = useBackground();
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const shapesCacheRef = useRef<Record<HoverState, { x: number, y: number }[]>>({
        'default': [],
        'developer': [],
        'organization': []
    });

    // Safe DOMURL reference
    const DOMURL = typeof window !== 'undefined' ? window.URL || window.webkitURL || window : null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !DOMURL) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = async () => {
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            initGrid(width, height);

            // Async preload shape coordinates for current screen size
            if (!shapesCacheRef.current.developer.length) {
                shapesCacheRef.current.developer = await getShapeCoordinates(DEV_BRACKETS_SVG, width, height, DOMURL, 4);
                shapesCacheRef.current.organization = await getShapeCoordinates(ORG_BUILDING_SVG, width, height, DOMURL, 4);
            }
        };

        const initGrid = (w: number, h: number) => {
            const pArray: Particle[] = [];
            const cols = Math.floor(w / DOT_SPACING) + 2;
            const rows = Math.floor(h / DOT_SPACING) + 2;

            const offsetX = (w - (cols * DOT_SPACING)) / 2;
            const offsetY = (h - (rows * DOT_SPACING)) / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * DOT_SPACING + offsetX;
                    const y = j * DOT_SPACING + offsetY;
                    const jitterX = (Math.random() - 0.5) * 8;
                    const jitterY = (Math.random() - 0.5) * 8;
                    pArray.push(new Particle(x + jitterX, y + jitterY));
                }
            }
            // Shuffle immediately so assigning shapes looks organic
            particlesRef.current = pArray.sort(() => 0.5 - Math.random());
        };

        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            ctx.fillStyle = 'rgba(252, 252, 253, 0.6)'; // Ghosting effect matching background
            ctx.fillRect(0, 0, width, height);

            const isHovering = hoverState !== 'default';
            const targetCoords = shapesCacheRef.current[hoverState];

            // Re-assign target coordinates dynamically if hovering a valid shape
            if (isHovering && targetCoords?.length > 0) {
                for (let i = 0; i < particlesRef.current.length; i++) {
                    const p = particlesRef.current[i];
                    if (i < targetCoords.length) {
                        p.isShape = true;
                        p.targetX = targetCoords[i].x;
                        p.targetY = targetCoords[i].y;
                    } else {
                        p.isShape = false;
                    }
                }
            } else {
                particlesRef.current.forEach(p => p.isShape = false);
            }

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
    }, [hoverState, DOMURL]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
