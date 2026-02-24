'use client';

import React, { useEffect, useRef } from 'react';
import { useBackground, HoverState } from '@/providers/BackgroundProvider';
import { simplex2 } from '@/utils/noise';

// Physics Configuration
const PARTICLE_COUNT = 4500; // Strict requirement: 4000 - 5000
const ACTIVE_COLOR = 'rgba(26, 115, 232, 0.9)'; // Brighter indigo for shapes

// Reynolds Steering Forces
const MAX_SPEED = 2.0;
const MAX_FORCE = 0.05;
const NOISE_SCALE = 0.002;
const NOISE_SPEED = 0.0002;

// Magnetic Attractor
const ATTRACTOR_RADIUS = 200;

class SpatialGrid {
    cellSize: number;
    cols: number;
    cells: Map<number, Particle[]>;

    constructor(width: number, height: number, cellSize: number) {
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.cells = new Map();
    }

    clear() {
        this.cells.clear();
    }

    insert(p: Particle) {
        const cx = Math.floor(p.x / this.cellSize);
        const cy = Math.floor(p.y / this.cellSize);
        const idx = cx + cy * this.cols;
        if (!this.cells.has(idx)) {
            this.cells.set(idx, []);
        }
        this.cells.get(idx)!.push(p);
    }

    queryNearby(x: number, y: number, radius: number): Particle[] {
        const results: Particle[] = [];
        const startX = Math.floor((x - radius) / this.cellSize);
        const endX = Math.floor((x + radius) / this.cellSize);
        const startY = Math.floor((y - radius) / this.cellSize);
        const endY = Math.floor((y + radius) / this.cellSize);

        for (let cy = startY; cy <= endY; cy++) {
            for (let cx = startX; cx <= endX; cx++) {
                const idx = cx + cy * this.cols;
                const cell = this.cells.get(idx);
                if (cell) {
                    results.push(...cell);
                }
            }
        }
        return results;
    }
}

class Particle {
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;

    // Stippling attributes
    size: number;
    baseAlpha: number;
    colorStr: string;

    // Drift anchors
    baseX: number;
    baseY: number;

    // Swarm targets
    targetX: number | null = null;
    targetY: number | null = null;
    isShape: boolean = false;

    // Brownian motion & juice
    seed: number;
    brownianSpeed: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = this.x;
        this.baseY = this.y;
        this.seed = Math.random() * 1000;
        this.brownianSpeed = 0.05 + Math.random() * 0.05;

        // Size between 0.5px and 2.5px
        this.size = 0.5 + Math.random() * 2.0;
        // Opacity between 0.2 and 0.8 depth
        this.baseAlpha = 0.2 + Math.random() * 0.6;
        this.colorStr = `rgba(26, 115, 232, ${this.baseAlpha})`;
    }

    // Craig Reynolds' "Seek and Arrive" Behavior
    steer(targetX: number, targetY: number, slowingRadius: number, overrideMaxSpeed?: number, overrideMaxForce?: number) {
        const ds = overrideMaxSpeed || MAX_SPEED;
        const df = overrideMaxForce || MAX_FORCE;

        const desiredX = targetX - this.x;
        const desiredY = targetY - this.y;
        const dist = Math.sqrt(desiredX * desiredX + desiredY * desiredY);

        if (dist === 0) return { x: 0, y: 0 };

        let mappedSpeed = ds;
        if (dist < slowingRadius) {
            mappedSpeed = (dist / slowingRadius) * ds; // Arrive behavior
        }

        const normX = (desiredX / dist) * mappedSpeed;
        const normY = (desiredY / dist) * mappedSpeed;

        let steerX = normX - this.vx;
        let steerY = normY - this.vy;

        // Limit steering force
        const steerDist = Math.sqrt(steerX * steerX + steerY * steerY);
        if (steerDist > df) {
            steerX = (steerX / steerDist) * df;
            steerY = (steerY / steerDist) * df;
        }

        return { x: steerX, y: steerY };
    }

    update(
        time: number,
        mouseX: number,
        mouseY: number,
        isHoveringShape: boolean,
        w: number,
        h: number
    ) {
        let fx = 0;
        let fy = 0;

        // 1. Morphing Geometry (Target-Seeking)
        if (isHoveringShape && this.isShape && this.targetX !== null && this.targetY !== null) {
            // Brownian Motion jitter (low amplitude)
            const brownianX = (simplex2(this.x + time * this.brownianSpeed, this.seed) * 2.5);
            const brownianY = (simplex2(this.seed - time * this.brownianSpeed, this.y) * 2.5);

            const targetPos = {
                x: this.targetX + brownianX,
                y: this.targetY + brownianY
            };

            // Push incredibly fast towards shape, arrive gently
            const force = this.steer(targetPos.x, targetPos.y, 50, MAX_SPEED * 3, MAX_FORCE * 2);
            fx += force.x;
            fy += force.y;

            // Elastic poke (repulsion)
            if (mouseX !== -1 && mouseY !== -1) {
                const dxMouse = mouseX - this.x;
                const dyMouse = mouseY - this.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distMouse < 60) {
                    const repulseForce = (60 - distMouse) * 0.05;
                    fx -= (dxMouse / distMouse) * repulseForce;
                    fy -= (dyMouse / distMouse) * repulseForce;
                }
            }
        }
        // 2. Ambient State
        else {
            // A. Ambient Noise Flow
            const angle = simplex2(this.x * NOISE_SCALE, this.y * NOISE_SCALE + time * NOISE_SPEED) * Math.PI * 2;
            // Floaty, liquid-like momentum
            const noiseForceX = Math.cos(angle) * 0.02;
            const noiseForceY = Math.sin(angle) * 0.02;
            fx += noiseForceX;
            fy += noiseForceY;

            // Keep them from totally dispersing out of bounds with a very weak center pull
            const dxBase = (w / 2) - this.x;
            const dyBase = (h / 2) - this.y;
            fx += dxBase * 0.00001;
            fy += dyBase * 0.00001;

            // B. Attractor State (Magnetic Cursor)
            if (mouseX !== -1 && mouseY !== -1 && !isHoveringShape) {
                const dxMouse = mouseX - this.x;
                const dyMouse = mouseY - this.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distMouse < ATTRACTOR_RADIUS) {
                    const cursorForce = this.steer(mouseX, mouseY, 100, MAX_SPEED * 2.5, MAX_FORCE * 4);
                    fx += cursorForce.x;
                    fy += cursorForce.y;
                }
            }
        }

        // Apply Acceleration (low linear damping)
        this.vx += fx;
        this.vy += fy;

        // Fluid speed limiting
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const speedLimit = (isHoveringShape && this.isShape) ? MAX_SPEED * 1.5 : MAX_SPEED;
        if (currentSpeed > speedLimit) {
            this.vx = (this.vx / currentSpeed) * speedLimit;
            this.vy = (this.vy / currentSpeed) * speedLimit;
        }

        // Low linear damping for ambient liquid momentum
        if (!isHoveringShape || !this.isShape) {
            this.vx *= 0.98;
            this.vy *= 0.98;
        } else {
            this.vx *= 0.92; // More friction in shapes to prevent infinite orbiting
            this.vy *= 0.92;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Organic bounds wrapping (don't teleport, just slide out and come back)
        if (!isHoveringShape) {
            if (this.x < -50) this.x = w + 50;
            if (this.x > w + 50) this.x = -50;
            if (this.y < -50) this.y = h + 50;
            if (this.y > h + 50) this.y = -50;
        }
    }

    draw(ctx: CanvasRenderingContext2D, isHoveringShape: boolean) {
        let color = this.colorStr;
        let renderSize = this.size;

        if (isHoveringShape) {
            if (this.isShape) {
                color = ACTIVE_COLOR;
                renderSize = this.size * 1.5;
            }
        }

        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, renderSize, renderSize);
    }
}

async function getShapeCoordinates(svgString: string, w: number, h: number, DOMURL: typeof window.URL | null, pointDensity: number = 6, offsetDir: 'left' | 'right' | 'center' = 'center'): Promise<{ x: number, y: number }[]> {
    return new Promise((resolve) => {
        if (!DOMURL) return resolve([]);

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = DOMURL.createObjectURL(svgBlob);

        img.onload = () => {
            const oc = document.createElement('canvas');
            const drawSize = 300; // Fixed crisp target size
            oc.width = drawSize;
            oc.height = drawSize;
            const octx = oc.getContext('2d', { willReadFrequently: true });
            if (!octx) return resolve([]);

            octx.drawImage(img, 0, 0, drawSize, drawSize);
            const data32 = new Uint32Array(octx.getImageData(0, 0, drawSize, drawSize).data.buffer);

            const coords: { x: number, y: number }[] = [];

            let offsetX = (w - drawSize) / 2;
            let offsetY = (h - drawSize) / 2 - 50;

            if (offsetDir === 'left') offsetX -= w * 0.2;
            if (offsetDir === 'right') offsetX += w * 0.2;

            for (let y = 0; y < drawSize; y += pointDensity) {
                for (let x = 0; x < drawSize; x += pointDensity) {
                    const alpha = data32[y * drawSize + x] & 0xff000000;
                    if (alpha !== 0) {
                        coords.push({
                            x: x + offsetX,
                            y: y + offsetY
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

// Ultra-sharp SVG shapes
const DEV_BRACKETS_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M 35 20 Q 20 20 20 35 L 20 45 Q 20 50 10 50 Q 20 50 20 55 L 20 65 Q 20 80 35 80" stroke="black" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M 65 20 Q 80 20 80 35 L 80 45 Q 80 50 90 50 Q 80 50 80 55 L 80 65 Q 80 80 65 80" stroke="black" stroke-width="10" stroke-linecap="round" fill="none"/>
</svg>`;

const ORG_BUILDING_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="30" stroke="black" stroke-width="6" fill="none"/>
  <circle cx="50" cy="50" r="15" stroke="black" stroke-width="6" fill="none"/>
  <circle cx="50" cy="50" r="2" fill="black"/>
  <line x1="20" y1="50" x2="80" y2="50" stroke="black" stroke-width="4"/>
  <line x1="50" y1="20" x2="50" y2="80" stroke="black" stroke-width="4"/>
</svg>`;

export function CanvasParticleBackground(): React.ReactElement {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { hoverState } = useBackground();

    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: -1, y: -1 });

    const shapesCacheRef = useRef<Record<HoverState, { x: number, y: number }[]>>({
        'default': [],
        'developer': [],
        'organization': []
    });

    const DOMURL = typeof window !== 'undefined' ? window.URL || window.webkitURL || window : null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !DOMURL) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        let width = window.innerWidth;
        let height = window.innerHeight;

        let grid = new SpatialGrid(width, height, 100);

        const resize = async () => {
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            grid = new SpatialGrid(width, height, 100);

            initParticles(width, height);

            if (!shapesCacheRef.current.developer.length) {
                shapesCacheRef.current.developer = await getShapeCoordinates(DEV_BRACKETS_SVG, width, height, DOMURL, 5, 'left');
                shapesCacheRef.current.organization = await getShapeCoordinates(ORG_BUILDING_SVG, width, height, DOMURL, 5, 'right');
            }
        };

        const initParticles = (w: number, h: number) => {
            const pArray: Particle[] = [];
            // Calculate dense coverage based on screen area, but strictly lock
            // the total count between 4000 and 5000 as requested by the prompt.
            const particleCount = Math.max(4000, Math.min(5000, Math.floor((w * h) / 400)));

            // Jittered Grid Distribution (Poisson-like)
            const area = w * h;
            const cellArea = area / particleCount;
            const cellSize = Math.sqrt(cellArea);
            const cols = Math.ceil(w / cellSize);
            const rows = Math.ceil(h / cellSize);

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (pArray.length >= particleCount) break;
                    // Jitter placement inside cell to look organic
                    const jx = (x + 0.1 + Math.random() * 0.8) * cellSize;
                    const jy = (y + 0.1 + Math.random() * 0.8) * cellSize;
                    pArray.push(new Particle(jx, jy));
                }
            }
            particlesRef.current = pArray;
        };

        window.addEventListener('resize', resize);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        resize();

        const animate = (time: number) => {
            ctx.clearRect(0, 0, width, height);

            const isHovering = hoverState !== 'default';
            const targetCoords = shapesCacheRef.current[hoverState];

            grid.clear();
            for (let i = 0; i < particlesRef.current.length; i++) {
                grid.insert(particlesRef.current[i]);
            }

            // Assign nearest particles to target shape
            if (isHovering && targetCoords?.length > 0) {
                if (!particlesRef.current[0].isShape) {
                    // Sort briefly to grab closest ones
                    particlesRef.current.sort((a, b) => {
                        const da = Math.abs(a.x - (width / 2)) + Math.abs(a.y - (height / 2));
                        const db = Math.abs(b.x - (width / 2)) + Math.abs(b.y - (height / 2));
                        return da - db;
                    });
                }
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

            // Query Spatial Hash for extreme O(1) performance nearby check
            const { x: mx, y: my } = mouseRef.current;
            const nearbyParticles = (mx !== -1 && my !== -1) ? new Set(grid.queryNearby(mx, my, ATTRACTOR_RADIUS)) : new Set<Particle>();

            particlesRef.current.forEach(p => {
                const isNearMouse = nearbyParticles.has(p);
                const mouseX = isNearMouse ? mx : -1;
                const mouseY = isNearMouse ? my : -1;

                p.update(time, mouseX, mouseY, isHovering, width, height);
                p.draw(ctx, isHovering);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
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
