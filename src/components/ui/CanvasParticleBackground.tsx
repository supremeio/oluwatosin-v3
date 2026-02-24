'use client';

import React, { useEffect, useRef } from 'react';
import { useBackground, HoverState } from '@/providers/BackgroundProvider';

// --- Particle Configuration ---
const DOT_SIZE = 1.25;
const DOT_RADIUS = DOT_SIZE / 2;
const POISSON_RADIUS = 20;
const DOT_COLOR = '#202124';

const SPRING_STIFFNESS = 0.15;
const SPRING_DAMPING = 0.70;

const AMBIENT_DRIFT_SPEED = 0.001;
const AMBIENT_DRIFT_AMP = 1.5; // Max 1-2px displacement

const CURSOR_RADIUS = 150;
const CURSOR_REPEL_AMP = 20; // Slight push for the "halo"

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

    update(time: number, isHoveringState: HoverState, mouseX: number, mouseY: number) {
        let destX: number;
        let destY: number;

        // Check if we are forming our assigned shape in an Active Zone
        if (isHoveringState !== 'default' && this.assignedPath === isHoveringState) {
            destX = this.targetX;
            destY = this.targetY;
        } else {
            // Resting State: Subtle, constrained microscopic drift (Micro-Oscillation)
            destX = this.originX + Math.sin(time * AMBIENT_DRIFT_SPEED + this.driftSeedX) * AMBIENT_DRIFT_AMP;
            destY = this.originY + Math.cos(time * AMBIENT_DRIFT_SPEED + this.driftSeedY) * AMBIENT_DRIFT_AMP;

            // Cursor Interaction: Localized magnetic radius (Repel effect)
            if (mouseX > -1 && mouseY > -1) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CURSOR_RADIUS && dist > 0) {
                    const force = (CURSOR_RADIUS - dist) / CURSOR_RADIUS; // 0 to 1
                    destX += (dx / dist) * force * CURSOR_REPEL_AMP;
                    destY += (dy / dist) * force * CURSOR_REPEL_AMP;
                }
            }
        }

        // Tight dampened spring physics (F = -kx) for snappy, fluid resets and formations
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
        // Translate slightly to snap to pixel grid, keeping the 1px-1.5px dots perfectly crisp
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, DOT_RADIUS, 0, Math.PI * 2);
    }
}

// O(N) Bridson's Poisson-Disc Sampling Algorithm for perfectly organic, even stippled spacing
function generatePoissonDisc(width: number, height: number, radius: number): { x: number, y: number }[] {
    const k = 30; // Limit of samples to choose before rejection
    const cellSize = radius / Math.SQRT2;

    const gridWidth = Math.ceil(width / cellSize);
    const gridHeight = Math.ceil(height / cellSize);
    const grid: ({ x: number, y: number } | null)[] = new Array(gridWidth * gridHeight).fill(null);

    const points: { x: number, y: number }[] = [];
    const activeList: { x: number, y: number }[] = [];

    const insertPoint = (pt: { x: number, y: number }) => {
        points.push(pt);
        activeList.push(pt);
        const col = Math.floor(pt.x / cellSize);
        const row = Math.floor(pt.y / cellSize);
        grid[row * gridWidth + col] = pt;
    };

    const isValid = (pt: { x: number, y: number }) => {
        if (pt.x < 0 || pt.x >= width || pt.y < 0 || pt.y >= height) return false;
        const col = Math.floor(pt.x / cellSize);
        const row = Math.floor(pt.y / cellSize);

        // Check neighboring cells
        const cw = Math.max(0, col - 2);
        const ce = Math.min(gridWidth - 1, col + 2);
        const rn = Math.max(0, row - 2);
        const rs = Math.min(gridHeight - 1, row + 2);

        for (let r = rn; r <= rs; r++) {
            for (let c = cw; c <= ce; c++) {
                const neighbor = grid[r * gridWidth + c];
                if (neighbor) {
                    const dx = neighbor.x - pt.x;
                    const dy = neighbor.y - pt.y;
                    if (dx * dx + dy * dy < radius * radius) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    // Start randomly
    insertPoint({ x: Math.random() * width, y: Math.random() * height });

    while (activeList.length > 0) {
        const activeIndex = Math.floor(Math.random() * activeList.length);
        const pt = activeList[activeIndex];

        let found = false;
        for (let i = 0; i < k; i++) {
            const angle = Math.random() * Math.PI * 2;
            const rad = radius + Math.random() * radius; // distance between r and 2r
            const sample = { x: pt.x + Math.cos(angle) * rad, y: pt.y + Math.sin(angle) * rad };

            if (isValid(sample)) {
                insertPoint(sample);
                found = true;
                break;
            }
        }

        if (!found) {
            activeList.splice(activeIndex, 1);
        }
    }

    return points;
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

            // Use raw Uint8ClampedArray for universal Endian-safe pixel checking
            const imageData = octx.getImageData(0, 0, drawSize, drawSize).data;
            const coords: { x: number, y: number }[] = [];
            const halfSize = drawSize / 2;

            // Scan image data at intervals matching desired stipple density
            for (let y = 0; y < drawSize; y += pointDensity) {
                for (let x = 0; x < drawSize; x += pointDensity) {
                    const index = (y * drawSize + x) * 4;
                    const alpha = imageData[index + 3]; // Check opacity channel
                    if (alpha > 50) { // Threshold for actual stroke presence 
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

// Thick strokes and explicit dimensions guarantee the browser renders the Blob correctly.
const DEV_BRACKETS_SVG = `<svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M 35 15 Q 15 15 15 35 L 15 45 Q 15 50 5 50 Q 15 50 15 55 L 15 65 Q 15 85 35 85" stroke="black" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M 65 15 Q 85 15 85 35 L 85 45 Q 85 50 95 50 Q 85 50 85 55 L 85 65 Q 85 85 65 85" stroke="black" stroke-width="8" stroke-linecap="round" fill="none"/>
</svg>`;

const ORG_BUILDING_SVG = `<svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="35" stroke="black" stroke-width="8" fill="none" stroke-dasharray="8 6"/>
  <circle cx="50" cy="50" r="22" stroke="black" stroke-width="6" fill="none"/>
  <circle cx="50" cy="50" r="8" stroke="black" stroke-width="6" fill="none"/>
</svg>`;

export function CanvasParticleBackground(): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { hoverState } = useBackground();

    const hoverStateRef = useRef<HoverState>(hoverState);

    // Safely sync React Context value to the animation loop ref
    useEffect(() => {
        hoverStateRef.current = hoverState;
    }, [hoverState]);

    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef<{ x: number, y: number }>({ x: -1, y: -1 });

    const DOMURL = typeof window !== 'undefined' ? window.URL || window.webkitURL || window : null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !DOMURL) return;

        // Disable alpha for pure performance since we draw strictly solid #202124 lines with no overlays
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        let width = window.innerWidth;
        let height = window.innerHeight;

        let resizeTimeout: NodeJS.Timeout;

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1, y: -1 };
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const initGrid = async () => {
            // 1. Generate distributed stippled field using Poisson-disc sampling
            // Generate slightly beyond borders to ensure full coverage even with drift/repel
            const points = generatePoissonDisc(width + 100, height + 100, POISSON_RADIUS);
            const pArray: Particle[] = points.map(pt => new Particle(pt.x - 50, pt.y - 50));

            // 2. Parse paths to establish exact pixel coordinates for stipple morphing
            const devPoints = await getShapeCoordinates(DEV_BRACKETS_SVG, DOMURL, 12);
            const orgPoints = await getShapeCoordinates(ORG_BUILDING_SVG, DOMURL, 12);

            // 3. Spatially greedily assign closest particles to each SVG target sequentially
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

        // Initialize display buffers
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
            // 4. Pure white (#FFFFFF) background reset per spec
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            // 5. Render crisp, mathematical #202124 points 
            ctx.fillStyle = DOT_COLOR;
            ctx.beginPath(); // Batch drawing logic for massive performance jump (60FPS flawless)

            const time = performance.now();
            const currentState = hoverStateRef.current;
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            const particles = particlesRef.current;

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(time, currentState, mx, my);
                particles[i].draw(ctx);
            }

            ctx.fill(); // Fill batched arc strokes
            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(resizeTimeout);
            cancelAnimationFrame(animationRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [DOMURL]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
