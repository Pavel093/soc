// nuxt.config.ts

import { regions } from './data/regions.js'
import { getAllSlugs } from './data/calculatorPages.js'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  
  css: ['~/assets/scss/global.scss'],
  
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false
    }
  },

  routeRules: {
    // Все страницы по умолчанию - SSG
    '/**': { 
      prerender: true 
    },
    
    // Embed страница - SSR
    '/embed': { 
      prerender: false, 
      ssr: true 
    },
    
    // Admin страница и все подстраницы - SSR
    '/admin': { 
      prerender: false, 
      ssr: true 
    },
    '/admin/**': { 
      prerender: false, 
      ssr: true 
    },
    
    // API маршруты - всегда серверные
    '/api/**': { 
      prerender: false,
      cors: true
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ru'
      },
      // ДОБАВЛЕНО: Preconnect для ускорения загрузки скрипта метрики
      link: [
        { rel: 'preconnect', href: 'https://mc.yandex.ru' }
      ],
      // УДАЛЕНО: Секция script с кодом метрики. Теперь это в плагине.
      
      // ОСТАВЛЕНО: Noscript важен для пользователей с отключенным JS
      noscript: [
        {
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/104348512" style="position:absolute; left:-9999px;" alt="" /></div>'
        }
      ],
      // УДАЛЕНО: __dangerouslyDisableSanitizersByTagID больше не нужен
    }
  },

  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  site: {
    url: 'https://всепособия.рф'
  },

  sitemap: {
    hostname: 'https://xn--90abjn2aafod7l.xn--p1ai',
    sources: ['/api/sitemap'],
    exclude: [
      '/admin',
      '/admin/**',
      '/embed',
      '/embed/**'
    ]
  },

  robots: {
    rules: {
      UserAgent: '*',
      Allow: '/',
      Disallow: ['/admin', '/embed'],
      Sitemap: 'https://всепособия.рф/sitemap.xml'
    }
  }
})
