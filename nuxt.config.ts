import tailwindcss from '@tailwindcss/vite'

const SITE_NAME = 'Midoricha'
const SITE_DESCRIPTION = 'The quiet craft behind Japanese matcha, from a single shaded leaf to a timeless ritual.'
const REVEAL_FALLBACK_SCRIPT =
  "(function(d){d.classList.add('js');setTimeout(function(){if(!d.classList.contains('reveal-ready'))d.classList.remove('js')},4000)})(document.documentElement)"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  components: [{ path: '~/components', pathPrefix: false }],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['three', 'lenis']
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: SITE_NAME,
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: SITE_DESCRIPTION },
        { name: 'theme-color', content: '#F7F8F6' },
        { name: 'apple-mobile-web-app-title', content: SITE_NAME },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:title', content: SITE_NAME }
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..700&family=Onest:wght@400;500;600&family=Noto+Serif+JP:wght@500;700&display=swap'
        }
      ],
      script: [{ innerHTML: REVEAL_FALLBACK_SCRIPT, tagPosition: 'head' }]
    }
  }
})
