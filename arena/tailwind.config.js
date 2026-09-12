/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['"Archivo Black"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#f4f4f0',
        paperalt: '#eae8e3',
        ink: '#0a0a0a',
        inksoft: '#2a2a2a',
        muted: '#6a6a6a',
        accent: '#e61919',
        accentdark: '#b81414',
        linesoft: '#c8c6c0',
      },
      boxShadow: {
        brutal: '6px 6px 0 0 #0a0a0a',
        'brutal-accent': '6px 6px 0 0 #e61919',
      },
    },
  },
  plugins: [],
}
