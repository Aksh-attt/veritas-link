/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aubergine: {
          950: "#090310",
          900: "#0D0617",
          850: "#130922",
          DEFAULT: "#1A0C2B",
          light: "#26133E",
          surface: "#31184F",
        },
        violet: {
          dark: "#2A0E47",
          DEFAULT: "#4B0082",
          electric: "#8127B5",
          neon: "#9D38EA",
        },
        magenta: {
          DEFAULT: "#F044D9",
          hover: "#E02FC7",
          light: "#F784E7",
        },
        coral: {
          DEFAULT: "#FF6B6B",
          dark: "#E85252",
          light: "#FFA099",
        },
        lavender: {
          light: "#F5E8FB",
          DEFAULT: "#E2CEF0",
          dark: "#BFA5D6",
        },
        grape: "#94618E",
        eggplant: "#49274A",
        electricCyan: {
          DEFAULT: "#00F0FF",
          hover: "#38BDF8",
          dark: "#0891B2",
          light: "#A5F3FC",
        },
        brightYellow: {
          DEFAULT: "#00F0FF",
          hover: "#38BDF8",
          dark: "#0891B2",
        },
        sand: "#F4DECB",
        offWhite: "#FCFAFF",
      },
      fontFamily: {
        display: ['"Syne"', '"Cabinet Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      }
    },
  },
  plugins: [],
}
