# Oluwatosin V3 — Portfolio

Portfolio site built from the [Figma design](https://www.figma.com/design/kDysuiPa3Hbrvt9R2Nkbh4/Oluwatosin-V3.?node-id=386-936). Implemented with Next.js 15, TypeScript, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Structure

- `src/app/page.tsx` — Main portfolio page (hero, work, writings, strength, process, footer)
- `src/components/layout/` — PageContainer
- `src/components/ui/` — SectionLabel and shared primitives
- `src/app/globals.css` — Design tokens and base styles

## Design tokens

Colors and typography match the Figma file:

- Background: `#ffffff`
- Foreground: `#2c2c2c`
- Muted / secondary: `#888888`
- Surface (nav, footer, buttons): `#1a1a1a`
