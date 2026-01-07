import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#FF00FF',
          blue: '#00FFFF',
          purple: '#9D00FF',
          green: '#39FF14',
        },
        dark: {
          bg: '#0a0e27',
          card: '#1a1f3a',
        },
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      boxShadow: {
        neon: '0 0 10px rgba(255, 0, 255, 0.5)',
        'neon-blue': '0 0 10px rgba(0, 255, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 255, 0.8)',
      },
    },
  },
  plugins: [],
}

export default config
