/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#FBF9F4', // Warm, inviting canvas
        'foreground': '#2D2D2D', // Primary text, WCAG AAA
        'primary': '#4A55A2',    // Interactive elements (a deep indigo)
        'muted': '#757575',      // Secondary info, metadata
      },
      fontFamily: {
        display: ['"Crimson Text"', 'Georgia', 'serif'],
        body: ['"Source Serif Pro"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-.02em', // For display font
        tighter: '-.01em',
        normal: '0',
        wider: '.01em',   // For body font
      },
      lineHeight: {
        'relaxed': '1.7', // For body font
      },
      boxShadow: {
        'lift': '0 8px 20px rgba(45, 45, 45, 0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}