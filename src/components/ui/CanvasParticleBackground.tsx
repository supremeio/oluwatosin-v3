'use client';

import React, { useEffect, useRef } from 'react';
import { useBackground, HoverState } from '@/providers/BackgroundProvider';
import { simplex2 } from '@/utils/noise';

// Physics Configuration
const PARTICLE_COUNT = 2400; // Dense fluid field
const DOT_SIZE = 1.5;
const AMBIENT_COLOR = '#00000030';
const ACTIVE_COLOR = '#4169FF';

// Forces
const NOISE_SCALE = 0.003;
const NOISE_SPEED = 0.0003;
const MAGNETIC_RADIUS = 150;
const MAGNETIC_FORCE = 0.03;
const SPRING_FACTOR = 0.08;
const SHAPE_SPRING = 0.05;
const FRICTION = 0.88;

class Particle {
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;

    // Drift anchors
    baseX: number;
    baseY: number;

    // Swarm targets
    targetX: number | null = null;
    targetY: number | null = null;
    isShape: boolean = false;

    // Kinetic juice variables
    seed: number;
    wobbleSpeed: number;

    constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.baseX = this.x;
        this.baseY = this.y;
        this.seed = Math.random() * 1000;
        this.wobbleSpeed = 0.1 + Math.random() * 0.1;
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

        // 1. Morphing Geometry Force (Swarming)
        if (isHoveringShape && this.isShape && this.targetX !== null && this.targetY !== null) {
            // Kinetic Wobble when resting in shape
            const wobbleX = Math.sin(time * this.wobbleSpeed + this.seed) * 2;
            const wobbleY = Math.cos(time * this.wobbleSpeed + this.seed) * 2;

            const dxTarget = (this.targetX + wobbleX) - this.x;
            const dyTarget = (this.targetY + wobbleY) - this.y;

            fx += dxTarget * SHAPE_SPRING;
            fy += dyTarget * SHAPE_SPRING;

            // Elastic cursor poke detection
            const dxMouse = mouseX - this.x;
            const dyMouse = mouseY - this.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distMouse < 60) {
                // Run away elastically
                const force = (60 - distMouse) * 0.05;
                fx -= (dxMouse / distMouse) * force;
                fy -= (dyMouse / distMouse) * force;
            }
        }
        // 2. Ambient Foundation (Noise Drift)
        else {
            // Fluid noise field
            const angle = simplex2(this.x * NOISE_SCALE, this.y * NOISE_SCALE + time * NOISE_SPEED) * Math.PI * 2;
            fx += Math.cos(angle) * 0.3;
            fy += Math.sin(angle) * 0.3;

            // Gentle spring back to origin bounded region so they don't all cluster over time
            const dxBase = this.baseX - this.x;
            const dyBase = this.baseY - this.y;
            fx += dxBase * 0.0005;
            fy += dyBase * 0.0005;

            // 3. Magnetic Interaction
            if (mouseX !== -1 && mouseY !== -1 && !isHoveringShape) {
                const dxMouse = mouseX - this.x;
                const dyMouse = mouseY - this.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                if (distMouse < MAGNETIC_RADIUS) {
                    const force = (MAGNETIC_RADIUS - distMouse) / MAGNETIC_RADIUS * MAGNETIC_FORCE;
                    fx += dxMouse * force;
                    fy += dyMouse * force;
                }
            }
        }

        // Apply forces
        this.vx += fx;
        this.vy += fy;
        this.vx *= FRICTION;
        this.vy *= FRICTION;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around gracefully if drifting offscreen
        if (!isHoveringShape) {
            if (this.x < 0) { this.x = w; this.baseX = w; }
            if (this.x > w) { this.x = 0; this.baseX = 0; }
            if (this.y < 0) { this.y = h; this.baseY = h; }
            if (this.y > h) { this.y = 0; this.baseY = 0; }
        }
    }

    draw(ctx: CanvasRenderingContext2D, isHoveringShape: boolean) {
        let color = AMBIENT_COLOR;
        let radius = DOT_SIZE / 2;
        let alpha = 1;

        if (isHoveringShape) {
            if (this.isShape) {
                color = ACTIVE_COLOR;
                radius = DOT_SIZE * 0.8;
            } else {
                color = AMBIENT_COLOR;
                alpha = 0.2; // Dim background stars
            }
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1; // Reset
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

        const resize = async () => {
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            initParticles(width, height);

            if (!shapesCacheRef.current.developer.length) {
                shapesCacheRef.current.developer = await getShapeCoordinates(DEV_BRACKETS_SVG, width, height, DOMURL, 5, 'left');
                shapesCacheRef.current.organization = await getShapeCoordinates(ORG_BUILDING_SVG, width, height, DOMURL, 5, 'right');
            }
        };

        const initParticles = (w: number, h: number) => {
            const pArray: Particle[] = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                pArray.push(new Particle(w, h));
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

            particlesRef.current.forEach(p => {
                p.update(time, mouseRef.current.x, mouseRef.current.y, isHovering, width, height);
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
