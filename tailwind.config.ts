import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        background: '#06080f',
        foreground: '#f8fafc',
        primary: {
          DEFAULT: '#2563eb',
          hover: '#1d4ed8',
          foreground: '#ffffff'
        },
        accent: {
          DEFAULT: '#14b8a6',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#111827',
          foreground: '#f8fafc'
        },
        muted: {
          DEFAULT: '#64748b',
          foreground: '#94a3b8'
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff'
        },
        border: 'rgba(148, 163, 184, 0.18)',
        surface: 'rgba(15, 23, 42, 0.78)',
        'surface-strong': 'rgba(15, 23, 42, 0.96)',
        cyan: {
          DEFAULT: '#22d3ee',
          glow: 'rgba(34, 211, 238, 0.22)'
        },
        sidebar: {
          DEFAULT: 'hsl(240, 6%, 7%)',
          foreground: 'hsl(210, 20%, 96%)',
          accent: 'hsl(217, 25%, 14%)',
          'accent-foreground': 'hsl(210, 20%, 98%)',
          border: 'hsl(217, 20%, 16%)',
          ring: 'hsl(217, 91%, 60%)',
          highlight: 'hsl(187, 85%, 53%)'
        },
        card: {
          DEFAULT: 'rgba(15, 23, 42, 0.78)',
          foreground: '#f8fafc'
        },
        popover: {
          DEFAULT: 'hsl(240, 6%, 10%)',
          foreground: '#f8fafc'
        }
      },
      borderRadius: {
        lg: '0.875rem',
        md: '0.75rem',
        sm: '0.5rem',
        xl: '0.875rem'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'card': '0 20px 25px -5px rgb(0 0 0 / 0.2)',
        'elevated': '0 24px 48px rgb(0 0 0 / 0.25)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' }
        },
        'slide-in': {
          from: { transform: 'translateY(4px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in': 'slide-in 0.2s ease-out',
        'scale-in': 'scale-in 0.15s ease-out'
      },
      spacing: {
        'header': 'var(--hx-header-height)'
      }
    }
  },
  plugins: [animate]
}

export default config
