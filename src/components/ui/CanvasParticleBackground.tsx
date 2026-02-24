'use client';

import React, { useEffect, useRef } from 'react';
import { useBackground, HoverState } from '@/providers/BackgroundProvider';

// --- Particle Configuration ---
const DOT_SIZE = 1.25;
const DOT_SPACING = 24;
const DOT_COLOR = '#202124';
const SPRING_STIFFNESS = 0.12;
const SPRING_DAMPING = 0.75;
const AMBIENT_DRIFT_SPEED = 0.0005;
const AMBIENT_DRIFT_AMP = 3;

class Particle {
    x: number;
    y: number;
    originX: number;
    originY: number;

    assignedPath: 'developer' | 'organization' | null = null;
    targetX: number = 0;
    targetY: number = 0;

    vx: number = 0;
    vy: number = 0;

    driftSeedX: number;
    driftSeedY: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        this.driftSeedX = Math.random() * Math.PI * 2;
        this.driftSeedY = Math.random() * Math.PI * 2;
    }

    update(time: number, isHoveringState: HoverState) {
        let destX: number;
        let destY: number;

        // Check if we are forming our assigned shape
        if (isHoveringState !== 'default' && this.assignedPath === isHoveringState) {
            destX = this.targetX;
            destY = this.targetY;
        } else {
            // Subtle, constrained microscopic drift
            destX = this.originX + Math.sin(time * AMBIENT_DRIFT_SPEED + this.driftSeedX) * AMBIENT_DRIFT_AMP;
            destY = this.originY + Math.cos(time * AMBIENT_DRIFT_SPEED + this.driftSeedY) * AMBIENT_DRIFT_AMP;
        }

        // Tight dampened spring physics
        const dx = destX - this.x;
        const dy = destY - this.y;

        this.vx += dx * SPRING_STIFFNESS;
        this.vy += dy * SPRING_STIFFNESS;
        this.vx *= SPRING_DAMPING;
        this.vy *= SPRING_DAMPING;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        // Round position to avoid anti-aliasing blur, ensuring perfectly crisp 1.25px solid dots.
        ctx.arc(Math.round(this.x), Math.round(this.y), DOT_SIZE, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Generate localized coordinates (-halfSize to +halfSize) by scanning an SVG drawn to an offscreen canvas.
async function getShapeCoordinates(svgString: string, DOMURL: typeof window.URL | null, pointDensity: number = 8): Promise<{ x: number, y: number }[]> {
    return new Promise((resolve) => {
        if (!DOMURL) return resolve([]);

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = DOMURL.createObjectURL(svgBlob);

        img.onload = () => {
            const oc = document.createElement('canvas');
            const drawSize = 400; // Hardcoded scaling canvas to match the widescreen zones
            oc.width = drawSize;
            oc.height = drawSize;
            const octx = oc.getContext('2d', { willReadFrequently: true });
            if (!octx) return resolve([]);

            // Draw SVG occupying the full draw size
            octx.drawImage(img, 0, 0, drawSize, drawSize);
            const data32 = new Uint32Array(octx.getImageData(0, 0, drawSize, drawSize).data.buffer);

            const coords: { x: number, y: number }[] = [];
            const halfSize = drawSize / 2;

            // Scan image data at intervals matching desired stipple density
            for (let y = 0; y < drawSize; y += pointDensity) {
                for (let x = 0; x < drawSize; x += pointDensity) {
                    const alpha = data32[y * drawSize + x] & 0xff000000;
                    if (alpha !== 0) {
                        coords.push({ x: x - halfSize, y: y - halfSize });
                    }
                }
            }

            DOMURL.revokeObjectURL(url);
            resolve(coords);
        };
        img.src = url;
    });
}

const DEV_BRACKETS_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M 35 15 Q 15 15 15 35 L 15 45 Q 15 50 5 50 Q 15 50 15 55 L 15 65 Q 15 85 35 85" stroke="black" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M 65 15 Q 85 15 85 35 L 85 45 Q 85 50 95 50 Q 85 50 85 55 L 85 65 Q 85 85 65 85" stroke="black" stroke-width="4" stroke-linecap="round" fill="none"/>
</svg>`;

const ORG_BUILDING_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="35" stroke="black" stroke-width="4" fill="none" stroke-dasharray="8 6"/>
  <circle cx="50" cy="50" r="22" stroke="black" stroke-width="3" fill="none"/>
  <circle cx="50" cy="50" r="8" stroke="black" stroke-width="3" fill="none"/>
</svg>`;

export function CanvasParticleBackground(): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { hoverState } = useBackground();

    // Track hover state internally via ref so the animation loop always reads the latest value
    // without re-firing the entire useEffect and resetting the Grid arrays.
    const hoverStateRef = useRef<HoverState>(hoverState);
    hoverStateRef.current = hoverState;

    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);

    const DOMURL = typeof window !== 'undefined' ? window.URL || window.webkitURL || window : null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !DOMURL) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        let width = window.innerWidth;
        let height = window.innerHeight;

        let resizeTimeout: NodeJS.Timeout;

        const initGrid = async () => {
            // 1. Generate distributed stippled field (Poison-disk like perturbed grid)
            const pArray: Particle[] = [];
            const cols = Math.floor(width / DOT_SPACING) + 2;
            const rows = Math.floor(height / DOT_SPACING) + 2;

            const offsetX = (width - (cols * DOT_SPACING)) / 2;
            const offsetY = (height - (rows * DOT_SPACING)) / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * DOT_SPACING + offsetX;
                    const y = j * DOT_SPACING + offsetY;

                    // Organic, stippled spacing, avoiding clumped randomness
                    const jitterAmount = DOT_SPACING * 0.4;
                    const jitterX = (Math.random() - 0.5) * 2 * jitterAmount;
                    const jitterY = (Math.random() - 0.5) * 2 * jitterAmount;
                    pArray.push(new Particle(x + jitterX, y + jitterY));
                }
            }

            // 2. Parse paths to establish targets for stipple morphing
            const devPoints = await getShapeCoordinates(DEV_BRACKETS_SVG, DOMURL, 10);
            const orgPoints = await getShapeCoordinates(ORG_BUILDING_SVG, DOMURL, 10);

            // 3. Spatially assign closest particles to each SVG target
            // For widescreen, map Dev to 30vw and Org to 70vw, otherwise stack centrally.
            const isMobile = width < 768;
            const devCenterX = isMobile ? width * 0.5 : width * 0.3;
            const orgCenterX = isMobile ? width * 0.5 : width * 0.7;
            const targetY = height * 0.5;

            devPoints.forEach(pt => {
                let closest = null;
                let minDist = Infinity;
                const globalX = devCenterX + pt.x;
                const globalY = targetY + pt.y;

                for (let i = 0; i < pArray.length; i++) {
                    const p = pArray[i];
                    if (p.assignedPath) continue;

                    const dx = p.originX - globalX;
                    const dy = p.originY - globalY;
                    const dist = dx * dx + dy * dy;
                    if (dist < minDist) {
                        minDist = dist;
                        closest = p;
                    }
                }
                if (closest) {
                    closest.assignedPath = 'developer';
                    closest.targetX = globalX;
                    closest.targetY = globalY;
                }
            });

            orgPoints.forEach(pt => {
                let closest = null;
                let minDist = Infinity;
                const globalX = orgCenterX + pt.x;
                const globalY = targetY + pt.y;

                for (let i = 0; i < pArray.length; i++) {
                    const p = pArray[i];
                    if (p.assignedPath) continue;

                    const dx = p.originX - globalX;
                    const dy = p.originY - globalY;
                    const dist = dx * dx + dy * dy;
                    if (dist < minDist) {
                        minDist = dist;
                        closest = p;
                    }
                }
                if (closest) {
                    closest.assignedPath = 'organization';
                    closest.targetX = globalX;
                    closest.targetY = globalY;
                }
            });

            particlesRef.current = pArray;
        };

        const handleResize = () => {
            // Debounce grid recalculation for continuous resizing
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                ctx.scale(dpr, dpr);
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                initGrid();
            }, 150);
        };

        // Trigger initial calculation directly.
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        initGrid();

        window.addEventListener('resize', handleResize);

        const animate = () => {
            // 4. Instanced pure white background clearing (no blurring, no trailing effects)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            // 5. Crisp, highly stippled dots rendered simultaneously
            ctx.fillStyle = DOT_COLOR;
            const time = Date.now();
            const currentState = hoverStateRef.current;

            const particles = particlesRef.current;
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(time, currentState);
                particles[i].draw(ctx);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
            cancelAnimationFrame(animationRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DOMURL]); // Intentionally omitting hoverState so canvas does not unmount.

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
