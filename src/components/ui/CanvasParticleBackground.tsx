'use client';

import { useEffect, useRef, useState } from 'react';

// ─── Configuration ─────────────────────────────────────────────────────────────
const POISSON_R = 20;

const DOT_R = 0.75;   // Ambient: 1.5 px diameter
const SHAPE_DOT_R = 1.0;    // Shape mode: 2 px diameter

// Resting physics — soft spring so particles feel like they float
const REST_K = 0.016;
const REST_DAMP = 0.92;

// Shape-forming physics — elastic pull
const SHAPE_K = 0.072;
const SHAPE_DAMP = 0.81;
const SPRING_RAMP = 500;    // ms — ease-in window: REST_K → SHAPE_K

// Ambient drift — dual-frequency Lissajous gives each particle a slow,
// organic looping path that's clearly visible but never distracting
const DRIFT_FREQ = 0.00136;
const DRIFT_AMP = 3.8;
const DRIFT_FREQ2 = 0.00056;
const DRIFT_AMP2 = 1.6;

// Cursor interaction — cubic ease-out for smoother halo edge
const REPEL_R = 190;
const REPEL_MAX = 32;
const SPEED_SCALE = 0.055;
const MAX_CV_SPEED = 5;
const SPEED_DECAY = 0.88;

// Layout
const CONTENT_W = 580;
const COL_GAP = 20;
const FADE_W = 120;  // gradient fade width at all four screen edges

// Emoji scan steps — three density tiers
const SCAN_STEP = 11;
const FILL_SCAN_STEP = 38;
const SLOW_SCAN_STEP = 12;

// Formation stagger windows (ms)
const OUTLINE_SPREAD = 1200;
const FILL_OFFSET = 300;
const FILL_SPREAD = 1900;
const SLOW_START = FILL_OFFSET + FILL_SPREAD;
const SLOW_DURATION = 27800;

const TEXT_APPEAR_AT = OUTLINE_SPREAD;

// Zone anchor margins (px)
const ZONE_TOP_MARGIN = 80;   // left emoji: top edge 80px from top
const ZONE_BOTTOM_MARGIN = 160;  // right emoji: bottom edge 160px from bottom

const LS_KEY = 'portfolio-emoji';

type Zone = 'dev' | 'org' | null;

// ─── Emoji pool ────────────────────────────────────────────────────────────────
const EMOJIS = [
  '⭐', '🌙', '❤️', '🔥', '💎',
  '🎯', '🦋', '🌊', '🌸', '⚡',
  '🍀', '🎭', '🐬', '🌈', '🦊',
];

// ─── Coloured stipple point ────────────────────────────────────────────────────
type Pt = { x: number; y: number; r: number; g: number; b: number };

// ─── Cached emoji data ─────────────────────────────────────────────────────────
interface EmojiPts {
  outline: Pt[];
  fill: Pt[];
  slow: Pt[];
  topY: number;  // min y of outline pts (negative — above centre)
  bottomY: number;  // max y
  minX: number;  // min x
  maxX: number;  // max x
}

// ─── Zone info (passed from canvas → React for overlay positioning) ────────────
interface ZoneInfo {
  zone: NonNullable<Zone>;
  cx: number;   // screen x of shape centre
  cy: number;   // screen y of shape centre
  topY: number;   // emoji top offset (topY < 0)
  bottomY: number;
  minX: number;
  maxX: number;
  emoji: string;
}

// ─── Emoji → coloured stipple points (synchronous canvas render) ──────────────
function emojiToPoints(emoji: string, step: number): Pt[] {
  const SIZE = 400;
  const oc = document.createElement('canvas');
  oc.width = SIZE;
  oc.height = SIZE;
  const ox = oc.getContext('2d', { willReadFrequently: true });
  if (!ox) return [];

  ox.font = '260px serif';
  ox.textAlign = 'center';
  ox.textBaseline = 'middle';
  ox.fillText(emoji, SIZE / 2, SIZE / 2);

  const data = ox.getImageData(0, 0, SIZE, SIZE).data;
  const half = SIZE / 2;
  const out: Pt[] = [];

  for (let y = 0; y < SIZE; y += step) {
    for (let x = 0; x < SIZE; x += step) {
      const i = (y * SIZE + x) * 4;
      if (data[i + 3] > 30) {
        out.push({ x: x - half, y: y - half, r: data[i], g: data[i + 1], b: data[i + 2] });
      }
    }
  }
  return out;
}

// ─── Poisson-disc sampling ─────────────────────────────────────────────────────
function poissonDisc(w: number, h: number, r: number): { x: number; y: number }[] {
  const k = 30;
  const cell = r / Math.SQRT2;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const grid: ({ x: number; y: number } | null)[] = new Array(cols * rows).fill(null);
  const pts: { x: number; y: number }[] = [];
  const active: { x: number; y: number }[] = [];

  function insert(p: { x: number; y: number }) {
    pts.push(p); active.push(p);
    grid[Math.floor(p.y / cell) * cols + Math.floor(p.x / cell)] = p;
  }

  function valid(p: { x: number; y: number }): boolean {
    if (p.x < 0 || p.x >= w || p.y < 0 || p.y >= h) return false;
    const c = Math.floor(p.x / cell);
    const rr = Math.floor(p.y / cell);
    for (let dr = -2; dr <= 2; dr++) {
      for (let dc = -2; dc <= 2; dc++) {
        const nr = Math.max(0, Math.min(rows - 1, rr + dr));
        const nc = Math.max(0, Math.min(cols - 1, c + dc));
        const nb = grid[nr * cols + nc];
        if (nb) {
          const dx = nb.x - p.x, dy = nb.y - p.y;
          if (dx * dx + dy * dy < r * r) return false;
        }
      }
    }
    return true;
  }

  insert({ x: Math.random() * w, y: Math.random() * h });

  while (active.length > 0) {
    const i = (Math.random() * active.length) | 0;
    const src = active[i];
    let found = false;
    for (let j = 0; j < k; j++) {
      const a = Math.random() * Math.PI * 2;
      const d = r + Math.random() * r;
      const s = { x: src.x + Math.cos(a) * d, y: src.y + Math.sin(a) * d };
      if (valid(s)) { insert(s); found = true; break; }
    }
    if (!found) active.splice(i, 1);
  }
  return pts;
}

// ─── Shared repulsion force ────────────────────────────────────────────────────
function addRepulsion(
  gx: number, gy: number,
  px: number, py: number,
  mx: number, my: number,
  cvSpeed: number,
): [number, number] {
  if (mx < 0) return [gx, gy];
  const dx = px - mx, dy = py - my;
  const d2 = dx * dx + dy * dy;
  if (d2 >= REPEL_R * REPEL_R || d2 === 0) return [gx, gy];
  const d = Math.sqrt(d2);
  const nt = 1 - d / REPEL_R;
  const f = nt * nt * nt * REPEL_MAX * (1 + cvSpeed * SPEED_SCALE);
  return [gx + (dx / d) * f, gy + (dy / d) * f];
}

// ─── Particle ──────────────────────────────────────────────────────────────────
class Particle {
  x: number; y: number;
  ox: number; oy: number;
  vx = 0; vy = 0;
  sx: number; sy: number;
  sx2: number; sy2: number;
  zone: Zone = null;
  tx = 0; ty = 0;
  tr = 0; tg = 0; tb = 0;
  startOffset = 0;

  constructor(x: number, y: number) {
    this.x = this.ox = x;
    this.y = this.oy = y;
    this.sx = Math.random() * Math.PI * 2;
    this.sy = Math.random() * Math.PI * 2;
    this.sx2 = Math.random() * Math.PI * 2;
    this.sy2 = Math.random() * Math.PI * 2;
  }

  update(
    now: number,
    dtN: number,
    restDampN: number,
    shapeDampN: number,
    zoneActivatedAtMap: Partial<Record<NonNullable<Zone>, number>>,
    mx: number, my: number,
    cvSpeed: number,
  ) {
    let inShape = false;
    let eased = 0;

    if (this.zone !== null) {
      const at = zoneActivatedAtMap[this.zone];
      if (at !== undefined) {
        const zoneAge = now - at;
        if (zoneAge >= this.startOffset) {
          inShape = true;
          const age = zoneAge - this.startOffset;
          const ramp = Math.min(age / SPRING_RAMP, 1);
          eased = ramp * ramp;
        }
      }
    }

    let gx: number, gy: number, k: number;

    if (inShape) {
      gx = this.tx; gy = this.ty;
      k = REST_K + (SHAPE_K - REST_K) * eased;

      if (eased >= 1) [gx, gy] = addRepulsion(gx, gy, this.x, this.y, mx, my, cvSpeed);
    } else {
      gx = this.ox
        + Math.sin(now * DRIFT_FREQ + this.sx) * DRIFT_AMP
        + Math.sin(now * DRIFT_FREQ2 + this.sx2) * DRIFT_AMP2;
      gy = this.oy
        + Math.cos(now * DRIFT_FREQ + this.sy) * DRIFT_AMP
        + Math.cos(now * DRIFT_FREQ2 + this.sy2) * DRIFT_AMP2;

      [gx, gy] = addRepulsion(gx, gy, this.x, this.y, mx, my, cvSpeed);
      k = REST_K;
    }

    // Delta-time normalised spring — makes physics frame-rate independent.
    // dampN is linearly interpolated between the two precomputed exponents
    // (REST_DAMP^dtN and SHAPE_DAMP^dtN) so we avoid a Math.pow per particle.
    const dampN = restDampN + (shapeDampN - restDampN) * eased;
    this.vx = (this.vx + (gx - this.x) * k * dtN) * dampN;
    this.vy = (this.vy + (gy - this.y) * k * dtN) * dampN;
    this.x += this.vx * dtN;
    this.y += this.vy * dtN;
  }

  draw(ctx: CanvasRenderingContext2D, r: number) {
    ctx.moveTo(this.x + r, this.y);
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
  }
}

// ─── assignZone ────────────────────────────────────────────────────────────────
function assignZone(
  particles: Particle[],
  targets: Pt[],
  cx: number, cy: number,
  zone: Zone,
  offsetMin: number, offsetMax: number,
) {
  const sorted = [...targets].sort(
    (a, b) => (a.x * a.x + a.y * a.y) - (b.x * b.x + b.y * b.y)
  );
  const n = sorted.length;

  for (let i = 0; i < n; i++) {
    const t = sorted[i];
    const gx = cx + t.x, gy = cy + t.y;
    let best: Particle | null = null, bestD = Infinity;

    for (const p of particles) {
      if (p.zone !== null) continue;
      const dx = p.ox - gx, dy = p.oy - gy;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = p; }
    }

    if (best) {
      best.zone = zone; best.tx = gx; best.ty = gy;
      best.tr = t.r; best.tg = t.g; best.tb = t.b;
      best.startOffset =
        offsetMin + (i / Math.max(n - 1, 1)) * (offsetMax - offsetMin) + Math.random() * 150;
    }
  }
}

// ─── assignZoneWave ────────────────────────────────────────────────────────────
function assignZoneWave(
  particles: Particle[],
  targets: Pt[],
  cx: number, cy: number,
  zone: Zone,
  xMin: number, xMax: number,
  offsetMin: number, offsetMax: number,
) {
  if (!targets.length) return;

  const available = particles
    .filter(p => p.zone === null && p.ox >= xMin && p.ox <= xMax)
    .sort((a, b) => {
      const da = (a.ox - cx) ** 2 + (a.oy - cy) ** 2;
      const db = (b.ox - cx) ** 2 + (b.oy - cy) ** 2;
      return da - db;
    });

  const n = available.length;
  if (!n) return;

  for (let i = 0; i < n; i++) {
    const p = available[i];
    let bestIdx = 0, bestDist = Infinity;

    for (let j = 0; j < targets.length; j++) {
      const t = targets[j];
      const dx = p.ox - (cx + t.x), dy = p.oy - (cy + t.y);
      const d = dx * dx + dy * dy;
      if (d < bestDist) { bestDist = d; bestIdx = j; }
    }

    const t = targets[bestIdx];
    p.zone = zone;
    p.tx = cx + t.x + (Math.random() * 3 - 1.5);
    p.ty = cy + t.y + (Math.random() * 3 - 1.5);
    p.tr = t.r; p.tg = t.g; p.tb = t.b;
    p.startOffset =
      offsetMin + (i / Math.max(n - 1, 1)) * (offsetMax - offsetMin) + Math.random() * 800;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CanvasParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Canvas → React bridges (called from canvas loop, always latest fn) ──────
  const onZoneActivateRef = useRef<(info: ZoneInfo) => void>(() => { });
  const onZoneDeactivateRef = useRef<(zone: NonNullable<Zone>) => void>(() => { });
  const clearSavedZoneRef = useRef<(zone: NonNullable<Zone>) => void>(() => { });

  // ── Saved emoji state (localStorage) ─────────────────────────────────────
  const savedEmojisRef = useRef<Partial<Record<NonNullable<Zone>, string>>>({});

  const [savedEmojis, setSavedEmojis] = useState<Partial<Record<NonNullable<Zone>, string>>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const parsed = JSON.parse(localStorage.getItem(LS_KEY) ?? 'null');
      const init = (parsed ?? {}) as Partial<Record<NonNullable<Zone>, string>>;
      savedEmojisRef.current = init;
      return init;
    } catch { return {}; }
  });
  // Keep ref in sync on every render
  savedEmojisRef.current = savedEmojis;

  // ── Which margin the cursor is currently in (null = content column or off-page)
  const [cursorMargin, setCursorMargin] = useState<NonNullable<Zone> | null>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const cL = w / 2 - CONTENT_W / 2 - COL_GAP;
      const cR = w / 2 + CONTENT_W / 2 + COL_GAP;
      if (e.clientX < cL) setCursorMargin('dev');
      else if (e.clientX > cR) setCursorMargin('org');
      else setCursorMargin(null);
    };
    const onLeave = () => setCursorMargin(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // ── Per-zone overlay state ─────────────────────────────────────────────────
  type HoverMode = 'save' | 'saved';
  const [zoneInfoMap, setZoneInfoMap] = useState<Partial<Record<NonNullable<Zone>, ZoneInfo>>>({});
  const [buttonVisibleMap, setButtonVisibleMap] = useState<Partial<Record<NonNullable<Zone>, boolean>>>({});
  const [hoverModeMap, setHoverModeMap] = useState<Partial<Record<NonNullable<Zone>, HoverMode>>>({});

  // Timers for delayed button appearance / auto-hide
  const showTimersRef = useRef<Partial<Record<NonNullable<Zone>, ReturnType<typeof setTimeout>>>>({});
  const hideTimersRef = useRef<Partial<Record<NonNullable<Zone>, ReturnType<typeof setTimeout>>>>({});

  // Signals the canvas loop to re-activate a zone after Clear (if cursor still there)
  const pendingReactivateRef = useRef<Zone>(null);

  // ── Callbacks (re-assigned every render, canvas reads via ref) ─────────────
  onZoneActivateRef.current = (info: ZoneInfo) => {
    setZoneInfoMap(prev => ({ ...prev, [info.zone]: info }));
    const isSaved = !!savedEmojisRef.current[info.zone];
    if (isSaved) {
      // Saved zone re-entered — keep button hidden; hitbox handles hover-to-clear
      setHoverModeMap(prev => ({ ...prev, [info.zone]: 'saved' }));
      setButtonVisibleMap(prev => ({ ...prev, [info.zone]: false }));
    } else {
      setHoverModeMap(prev => ({ ...prev, [info.zone]: 'save' }));
      setButtonVisibleMap(prev => ({ ...prev, [info.zone]: false }));
      clearTimeout(showTimersRef.current[info.zone]);
      const z = info.zone;
      showTimersRef.current[z] = setTimeout(() => {
        setButtonVisibleMap(prev => ({ ...prev, [z]: true }));
      }, TEXT_APPEAR_AT);
    }
  };

  onZoneDeactivateRef.current = (zone: NonNullable<Zone>) => {
    clearTimeout(showTimersRef.current[zone]);
    clearTimeout(hideTimersRef.current[zone]);
    setZoneInfoMap(prev => { const n = { ...prev }; delete n[zone]; return n; });
    setButtonVisibleMap(prev => { const n = { ...prev }; delete n[zone]; return n; });
    setHoverModeMap(prev => { const n = { ...prev }; delete n[zone]; return n; });
  };

  // ── Save / Clear handlers ──────────────────────────────────────────────────
  const handleSave = (zone: NonNullable<Zone>) => {
    const info = (zoneInfoMap as Record<string, ZoneInfo>)[zone];
    if (!info) return;
    const updated = { ...savedEmojisRef.current, [zone]: info.emoji };
    savedEmojisRef.current = updated;
    setSavedEmojis(updated);
    try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch { }

    // Show "Saved!" immediately, then auto-hide after 2 s
    setHoverModeMap(prev => ({ ...prev, [zone]: 'saved' }));
    setButtonVisibleMap(prev => ({ ...prev, [zone]: true }));
    clearTimeout(hideTimersRef.current[zone]);
    hideTimersRef.current[zone] = setTimeout(() => {
      setButtonVisibleMap(prev => ({ ...prev, [zone]: false }));
    }, 2000);
  };

  const handleClear = (zone: NonNullable<Zone>) => {
    const updated = { ...savedEmojisRef.current };
    delete updated[zone];
    savedEmojisRef.current = updated;
    setSavedEmojis(updated);
    try { localStorage.setItem(LS_KEY, JSON.stringify(updated)); } catch { }
    clearSavedZoneRef.current(zone);
    // React cleanup handled by clearSavedZoneRef calling onZoneDeactivateRef
  };

  // ── Canvas effect ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let W = window.innerWidth, H = window.innerHeight;

    let colL = 0, colR = 0, leftCX = 0, rightCX = 0;

    function updateGeometry() {
      colL = W / 2 - CONTENT_W / 2 - COL_GAP;
      colR = W / 2 + CONTENT_W / 2 + COL_GAP;
      leftCX = colL / 2;
      rightCX = colR + (W - colR) / 2;
    }

    function sizeCanvas() {
      W = window.innerWidth; H = window.innerHeight;
      canvas!.width = W * dpr; canvas!.height = H * dpr;
      ctx!.scale(dpr, dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      updateGeometry();
    }
    sizeCanvas();

    // ── Pre-compute emoji caches ───────────────────────────────────────────
    const emojiCache = new Map<string, EmojiPts>();
    for (const emoji of EMOJIS) {
      const outline = emojiToPoints(emoji, SCAN_STEP);
      const xs = outline.map(p => p.x);
      const ys = outline.map(p => p.y);
      emojiCache.set(emoji, {
        outline,
        fill: emojiToPoints(emoji, FILL_SCAN_STEP),
        slow: emojiToPoints(emoji, SLOW_SCAN_STEP),
        topY: outline.length ? Math.min(...ys) : -130,
        bottomY: outline.length ? Math.max(...ys) : 130,
        minX: outline.length ? Math.min(...xs) : -130,
        maxX: outline.length ? Math.max(...xs) : 130,
      });
    }

    // ── Mouse / zone state ────────────────────────────────────────────────
    let mx = -1, my = -1, activeZone: Zone = null, cvSpeed = 0, lastMt = 0;

    function onMove(e: MouseEvent) {
      const now = performance.now();
      if (mx >= 0 && lastMt > 0) {
        const dt = now - lastMt;
        if (dt > 0) {
          const vx = (e.clientX - mx) / dt, vy = (e.clientY - my) / dt;
          cvSpeed = Math.min(Math.sqrt(vx * vx + vy * vy), MAX_CV_SPEED);
        }
      }
      lastMt = now; mx = e.clientX; my = e.clientY;
      if (W >= 768) {
        activeZone = mx < colL ? 'dev' : mx > colR ? 'org' : null;
      } else {
        activeZone = null;
      }
    }

    function onLeave() { mx = -1; my = -1; activeZone = null; cvSpeed = 0; lastMt = 0; }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    // ── Particle field ────────────────────────────────────────────────────
    let particles: Particle[] = poissonDisc(W + 100, H + 100, POISSON_R)
      .map(p => new Particle(p.x - 50, p.y - 50));

    // ── Zone state (canvas-side) ──────────────────────────────────────────
    const zoneEmoji: Partial<Record<NonNullable<Zone>, string>> = {};
    const zonePts: Partial<Record<NonNullable<Zone>, EmojiPts>> = {};
    const zoneActivatedAtMap: Partial<Record<NonNullable<Zone>, number>> = {};

    function activateZone(zone: NonNullable<Zone>, forceEmoji?: string) {
      for (const p of particles) { if (p.zone === zone) p.zone = null; }

      let emoji: string;
      let pts: EmojiPts | undefined;

      if (forceEmoji) {
        emoji = forceEmoji;
        pts = emojiCache.get(emoji);
      } else {
        emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        pts = emojiCache.get(emoji);
        for (let i = 1; (!pts || !pts.outline.length) && i < EMOJIS.length; i++) {
          emoji = EMOJIS[(EMOJIS.indexOf(emoji) + 1) % EMOJIS.length];
          pts = emojiCache.get(emoji);
        }
      }

      if (!pts || !pts.outline.length) return;

      zoneEmoji[zone] = emoji;
      zonePts[zone] = pts;

      const cx = zone === 'dev' ? leftCX : rightCX;
      const cy = zone === 'dev'
        ? ZONE_TOP_MARGIN - pts.topY          // top edge of emoji at ZONE_TOP_MARGIN
        : H - ZONE_BOTTOM_MARGIN - pts.bottomY; // bottom edge at H - ZONE_BOTTOM_MARGIN

      // Notify React overlay
      onZoneActivateRef.current({
        zone, cx, cy,
        topY: pts.topY,
        bottomY: pts.bottomY,
        minX: pts.minX,
        maxX: pts.maxX,
        emoji,
      });

      assignZone(particles, pts.outline, cx, cy, zone, 0, OUTLINE_SPREAD);
      assignZone(particles, pts.fill, cx, cy, zone, FILL_OFFSET, FILL_OFFSET + FILL_SPREAD);
      assignZoneWave(
        particles, pts.slow, cx, cy, zone,
        zone === 'dev' ? -Infinity : colR,
        zone === 'dev' ? colL : Infinity,
        SLOW_START, SLOW_START + SLOW_DURATION,
      );
    }

    function releaseZone(zone: NonNullable<Zone>) {
      for (const p of particles) { if (p.zone === zone) p.zone = null; }
      delete zoneEmoji[zone];
      delete zonePts[zone];
      delete zoneActivatedAtMap[zone];
      onZoneDeactivateRef.current(zone);
    }

    // Expose clear handler to React
    clearSavedZoneRef.current = (zone: NonNullable<Zone>) => {
      releaseZone(zone);
      // If cursor is still hovering that margin, queue a fresh emoji immediately
      if (activeZone === zone) {
        pendingReactivateRef.current = zone;
      }
    };

    // Auto-restore saved zones on mount
    for (const [z, emoji] of Object.entries(savedEmojisRef.current) as [NonNullable<Zone>, string][]) {
      zoneActivatedAtMap[z] = performance.now();
      activateZone(z, emoji);
    }

    // ── Resize ────────────────────────────────────────────────────────────
    let resizeTimer: ReturnType<typeof setTimeout>;

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        sizeCanvas();
        particles = poissonDisc(W + 100, H + 100, POISSON_R)
          .map(p => new Particle(p.x - 50, p.y - 50));

        // Clear all zone data and re-activate
        for (const z of ['dev', 'org'] as NonNullable<Zone>[]) {
          delete zoneEmoji[z];
          delete zonePts[z];
          delete zoneActivatedAtMap[z];
        }

        // Re-activate saved zones first
        for (const [z, emoji] of Object.entries(savedEmojisRef.current) as [NonNullable<Zone>, string][]) {
          zoneActivatedAtMap[z] = performance.now();
          activateZone(z, emoji);
        }

        // Re-activate cursor zone if not already saved
        if (activeZone && !savedEmojisRef.current[activeZone]) {
          zoneActivatedAtMap[activeZone] = performance.now();
          activateZone(activeZone);
        }
      }, 200);
    }

    window.addEventListener('resize', onResize);

    // ── Zone transition tracking ──────────────────────────────────────────
    let prevActiveZone: Zone = null;

    // ── Render loop ───────────────────────────────────────────────────────
    let raf: number;
    let prevNow = 0;

    function loop() {
      const now = performance.now();
      // Normalised delta-time (1.0 = one 60 fps frame). Capped at 2.5× to
      // prevent instability after tab-switch or long pauses.
      const dtN = prevNow > 0 ? Math.min((now - prevNow) / (1000 / 60), 2.5) : 1;
      prevNow = now;
      // Precompute per-frame damping exponents once, interpolated per-particle.
      const restDampN = REST_DAMP ** dtN;
      const shapeDampN = SHAPE_DAMP ** dtN;

      // Re-activate a zone cleared while cursor was still inside it
      if (pendingReactivateRef.current !== null) {
        const z = pendingReactivateRef.current as NonNullable<Zone>;
        pendingReactivateRef.current = null;
        zoneActivatedAtMap[z] = now;
        activateZone(z);
        prevActiveZone = z; // Prevent transition logic from double-firing this frame
      }

      // Detect cursor zone transitions
      if (activeZone !== prevActiveZone) {
        if (prevActiveZone !== null) {
          const isSaved = !!savedEmojisRef.current[prevActiveZone];
          if (!isSaved) {
            releaseZone(prevActiveZone);
          }
          // If saved: particles stay, React keeps overlay
        }

        if (activeZone !== null) {
          if (zoneActivatedAtMap[activeZone] === undefined) {
            // Fresh zone — activate
            zoneActivatedAtMap[activeZone] = now;
            activateZone(activeZone);
          } else {
            // Returning to an already-active saved zone — re-notify React
            const pts = zonePts[activeZone];
            const cx = activeZone === 'dev' ? leftCX : rightCX;
            if (pts && zoneEmoji[activeZone]) {
              const cy = activeZone === 'dev'
                ? ZONE_TOP_MARGIN - pts.topY
                : H - ZONE_BOTTOM_MARGIN - pts.bottomY;
              onZoneActivateRef.current({
                zone: activeZone, cx, cy,
                topY: pts.topY,
                bottomY: pts.bottomY,
                minX: pts.minX,
                maxX: pts.maxX,
                emoji: zoneEmoji[activeZone]!,
              });
            }
          }
        }

        prevActiveZone = activeZone;
      }

      cvSpeed *= SPEED_DECAY ** dtN;

      const dark = document.documentElement.getAttribute('data-theme') === 'dark';

      ctx!.fillStyle = dark ? '#0f0f0f' : '#ffffff';
      ctx!.fillRect(0, 0, W, H);

      if (W >= 768) {
        ctx!.save();
        ctx!.beginPath();
        ctx!.rect(0, 0, colL, H);
        ctx!.rect(colR, 0, W - colR, H);
        ctx!.clip();

        // Helper: is this particle currently in shape mode?
        const isShapeParticle = (p: Particle) => {
          if (p.zone === null) return false;
          const at = zoneActivatedAtMap[p.zone];
          if (at === undefined) return false;
          return now - at >= p.startOffset;
        };

        // ── Physics update ──────────────────────────────────────────────
        for (const p of particles) {
          p.update(now, dtN, restDampN, shapeDampN, zoneActivatedAtMap, mx, my, cvSpeed);
        }

        // ── Pass 1: ambient dots ────────────────────────────────────────
        ctx!.fillStyle = dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.5)';
        ctx!.beginPath();
        for (const p of particles) {
          if (!isShapeParticle(p)) p.draw(ctx!, DOT_R);
        }
        ctx!.fill();

        // ── Pass 2: shape particles with emoji colour blend ─────────────
        for (const p of particles) {
          if (!isShapeParticle(p)) continue;

          const at = zoneActivatedAtMap[p.zone!]!;
          const zoneAge = now - at;
          const age = zoneAge - p.startOffset;
          const ramp = Math.min(age / SPRING_RAMP, 1);
          const eased = ramp * ramp;

          const r = DOT_R + (SHAPE_DOT_R - DOT_R) * eased;
          const startC = dark ? 255 : 0;
          const cr = Math.round(startC + (p.tr - startC) * eased);
          const cg = Math.round(startC + (p.tg - startC) * eased);
          const cb = Math.round(startC + (p.tb - startC) * eased);
          const ca = 0.5 + 0.5 * eased;

          ctx!.fillStyle = `rgba(${cr},${cg},${cb},${ca})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx!.fill();
        }

        // ── Inner-edge gradient fade (clipped to margin columns) ───────
        // Fades particles toward the content column border.
        const bgRGB = dark ? '15,15,15' : '255,255,255';
        const transp = `rgba(${bgRGB},0)`;
        const opaque = `rgba(${bgRGB},1)`;

        // Left margin inner edge — transparent → opaque toward content
        const gradL = ctx!.createLinearGradient(colL - FADE_W, 0, colL, 0);
        gradL.addColorStop(0, transp);
        gradL.addColorStop(1, opaque);
        ctx!.fillStyle = gradL;
        ctx!.fillRect(Math.max(0, colL - FADE_W), 0, FADE_W, H);

        // Right margin inner edge — opaque toward content → transparent
        const gradR = ctx!.createLinearGradient(colR, 0, colR + FADE_W, 0);
        gradR.addColorStop(0, opaque);
        gradR.addColorStop(1, transp);
        ctx!.fillStyle = gradR;
        ctx!.fillRect(colR, 0, FADE_W, H);

        ctx!.restore();

        // ── Outer screen-edge fades (full viewport, no clip) ───────────
        // Fades particles at all four screen borders.
        const gradOL = ctx!.createLinearGradient(0, 0, FADE_W, 0);
        gradOL.addColorStop(0, opaque);
        gradOL.addColorStop(1, transp);
        ctx!.fillStyle = gradOL;
        ctx!.fillRect(0, 0, FADE_W, H);

        const gradOR = ctx!.createLinearGradient(W - FADE_W, 0, W, 0);
        gradOR.addColorStop(0, transp);
        gradOR.addColorStop(1, opaque);
        ctx!.fillStyle = gradOR;
        ctx!.fillRect(W - FADE_W, 0, FADE_W, H);

        const gradOT = ctx!.createLinearGradient(0, 0, 0, FADE_W);
        gradOT.addColorStop(0, opaque);
        gradOT.addColorStop(1, transp);
        ctx!.fillStyle = gradOT;
        ctx!.fillRect(0, 0, W, FADE_W);

        const gradOB = ctx!.createLinearGradient(0, H - FADE_W, 0, H);
        gradOB.addColorStop(0, transp);
        gradOB.addColorStop(1, opaque);
        ctx!.fillStyle = gradOB;
        ctx!.fillRect(0, H - FADE_W, W, FADE_W);
      }

      raf = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ── Overlay JSX ───────────────────────────────────────────────────────────
  const zones = Object.keys(zoneInfoMap) as NonNullable<Zone>[];

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
      />

      {zones.map(zone => {
        const info = zoneInfoMap[zone]!;
        const visible = !!buttonVisibleMap[zone];
        const hoverMode = hoverModeMap[zone] ?? 'save';
        const isSaved = !!savedEmojis[zone];

        // Both zones: label below the emoji, centred on cx.
        const btnLeft = info.cx;
        const btnTop = zone === 'dev'
          ? info.cy + info.bottomY + 56   // 56px below the left emoji's bottom edge
          : info.cy + info.bottomY + 40;  // 40px below the right emoji's bottom edge

        const labelStyle: React.CSSProperties = {
          position: 'fixed',
          zIndex: 2,
          left: btnLeft,
          top: btnTop,
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'Figtree, system-ui, sans-serif',
          fontWeight: 500,
          fontSize: '15px',
          lineHeight: '150%',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          color: 'var(--icon-active)',
        };

        return (
          <div key={zone}>
            {/* ── Save the emoji? / Saved! toast ─────────────────────────── */}
            <div
              style={{
                ...labelStyle,
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.7s ease',
                pointerEvents: visible ? 'auto' : 'none',
              }}
            >
              {!isSaved && hoverMode === 'save' && (
                <button
                  className="flex items-center gap-[6px] cursor-pointer"
                  style={{ color: 'inherit', background: 'none', border: 'none', padding: 0, font: 'inherit' }}
                  onMouseEnter={e => {
                    const path = e.currentTarget.querySelector<SVGPathElement>('path');
                    if (path) path.style.stroke = '#48BA77';
                  }}
                  onMouseLeave={e => {
                    const path = e.currentTarget.querySelector<SVGPathElement>('path');
                    if (path) path.style.stroke = 'var(--icon-active)';
                  }}
                  onClick={() => handleSave(zone)}
                >
                  Save the emoji?
                  {/* Icon on the right; only its stroke changes on hover */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <path
                      d="M4.1665 10.8335L7.49984 14.1668L15.8332 5.8335"
                      style={{ stroke: 'var(--icon-active)', transition: 'stroke 0.15s ease' }}
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}

              {isSaved && hoverMode === 'saved' && <span>Saved!</span>}
            </div>

            {/* ── Clear emoji — shown whenever mouse is on the canvas and
                   the emoji is saved (hidden while the "Saved!" toast shows) ── */}
            {isSaved && cursorMargin === zone && !visible && (
              <div style={{ ...labelStyle, pointerEvents: 'auto' }}>
                <button
                  className="cursor-pointer"
                  style={{ color: 'var(--icon-active)', background: 'none', border: 'none', padding: 0, font: 'inherit' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E5484D')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--icon-active)')}
                  onClick={() => handleClear(zone)}
                >
                  Clear emoji
                </button>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
