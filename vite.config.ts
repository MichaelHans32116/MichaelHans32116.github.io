import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/app.js',
        chunkFileNames: 'assets/js/[name].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.names?.[0] ?? assetInfo.name ?? ''
          if (name.endsWith('.css')) {
            return name === 'index.css' ? 'assets/css/theme.css' : 'assets/css/[name][extname]'
          }
          if (/\.(png|jpe?g|webp|gif|svg|ico)$/i.test(name)) return 'assets/images/[name][extname]'
          return 'assets/media/[name][extname]'
        },
        manualChunks(rawId) {
          const id = rawId.replace(/\\/g, '/')
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons'
          if (id.includes('/src/audio/')) return 'audio-engine'
          if (id.includes('/src/data/')) return 'portfolio-data'
          if (id.includes('/src/components/draw/')) return 'draw-phase'
          if (id.includes('/src/components/tray/')) return 'phase-tray'
          if (id.includes('/src/components/walkthrough/')) return 'walkthrough-tour'
          if (id.includes('/src/components/DuelFieldBg')) return 'duel-field'
          if (
            id.includes('/src/components/DeckCard') ||
            id.includes('/src/components/HoloYugiohCard') ||
            id.includes('/src/components/MediaCarousel')
          ) {
            return 'card-viewer'
          }
          if (id.includes('/src/sections/HomeSection') || id.includes('/src/components/TechToolkit')) {
            return 'section-home'
          }
          if (id.includes('/src/sections/DeckSection') || id.includes('/src/components/DuelDeckBoxCard')) {
            return 'section-deck'
          }
          if (id.includes('/src/sections/ExperienceSection')) return 'section-experience'
          if (id.includes('/src/sections/AboutSection')) return 'section-about'
          if (id.includes('/src/sections/ContactSection')) return 'section-contact'
        },
      },
    },
  },
})
