// nuxt.config.ts

import { regions } from './data/regions.js'
import { getAllSlugs } from './data/calculatorPages.js'

// Список роутов в разработке, которые нужно скрыть от индексации
const devRoutes = [
  '/alimenty',
  '/bolnichniy',
  '/dekretnye',
  '/kompensaciya-detsad',
  '/nalogovyy-vychet',
  '/otpusknye',
  '/posobie-do-polutora-let',
  '/raschet-dekretnyh',
  '/semeynaya-ipoteka',
  '/semeynyy-byudzhet',
  '/vyplata-iz-matkapitala',
]

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
    },

    // ==========================================================
    // Устанавливаем мета-тег noindex для каждой страницы
    '/alimenty': { index: false },
    '/bolnichniy': { index: false },
    '/dekretnye': { index: false },
    '/kompensaciya-detsad': { index: false },
    '/nalogovyy-vychet': { index: false },
    '/otpusknye': { index: false },
    '/posobie-do-polutora-let': { index: false },
    '/raschet-dekretnyh': { index: false },
    '/semeynaya-ipoteka': { index: false },
    '/semeynyy-byudzhet': { index: false },
    '/vyplata-iz-matkapitala': { index: false },
    // ==========================================================
    // КОНЕЦ: Правила для страниц в разработке
    // ==========================================================
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ru'
      },
      link: [
        { rel: 'preconnect', href: 'https://mc.yandex.ru' }
      ],
      noscript: [
        {
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/104348512" style="position:absolute; left:-9999px;" alt="" /></div>'
        }
      ],
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
    sources: ['/api/sitemap'],
    // Исключаем страницы из sitemap.xml
    exclude: [
      '/admin',
      '/admin/**',
      '/embed',
      '/embed/**',
      ...devRoutes // Добавляем сюда список страниц в разработке
    ]
  },

  robots: {
    rules: {
      UserAgent: '*',
      Allow: '/',
      // Запрещаем сканирование страниц в robots.txt
      Disallow: [
        '/admin', 
        '/embed',
        ...devRoutes // Добавляем сюда список страниц в разработке
      ],
      Sitemap: 'https://всепособия.рф/sitemap.xml'
    }
  }
})
