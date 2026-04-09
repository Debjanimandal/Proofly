import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        surface: '#0A0A0A',
        card: '#111111',
        elevated: '#1A1A1A',
        text: '#FFFFFF',
        subtext: '#B3B3B3',
        muted: '#666666',
        border: 'rgba(255,255,255,0.08)',
        danger: '#7A1A1A'
      }
    }
  },
  plugins: []
};

export default config;
