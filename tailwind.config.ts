import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        figtree: ['var(--font-figtree)', 'sans-serif'],
        sora: ['var(--font-sora)', 'sans-serif'],
        'kode-mono': ['var(--font-kode-mono)', 'monospace'],
      },
      colors: {
        'bg-main': 'var(--bg-main)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-on-colour': 'var(--bg-on-colour)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-on-colour': 'var(--text-on-colour)',
        'icon-active': 'var(--icon-active)',
        'icon-inactive': 'var(--icon-inactive)',
        'icon-on-colour': 'var(--icon-on-colour)',
        'border-primary': 'var(--border-primary)',
        'border-active': 'var(--border-active)',
        'overlay-page': 'var(--overlay-page)',
        'overlay-local': 'var(--overlay-local)',
      },
    },
  },
  plugins: [],
};

export default config;
