/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{jsx,js}'],
  theme: {
    extend: {
      colors: {
        bg:               '#0f0f1a',
        surface:          '#1a1a2e',
        'surface-2':      '#222240',
        border:           '#2a2a45',
        gold:             '#c9a84c',
        'gold-light':     '#e0c070',
        'gold-dim':       '#8a6e2a',
        muted:            '#6b6b8a',
        'text-main':      '#e8e8f0',
        'text-sub':       '#a0a0c0',
        burgundy:         '#8b1a2e',
        'burgundy-light': '#d4405c',
        saffron:          '#c85a1a',
        'saffron-light':  '#e8804a',
        'indigo-jewel':   '#3d2463',
        'indigo-light':   '#8b6bc4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
