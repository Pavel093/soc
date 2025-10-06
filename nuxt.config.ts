// nuxt.config.ts

// import { regions } from './data/regions.js' // Эти импорты, вероятно, вам еще нужны
// import { getAllSlugs } from './data/calculatorPages.js'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // ... devServer, nitro, routeRules ... (оставляем без изменений)
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
    '/**': { prerender: true },
    '/embed': { prerender: false, ssr: true },
    '/admin': { prerender: false, ssr: true },
    '/admin/**': { prerender: false, ssr: true },
    '/api/**': { prerender: false, cors: true }
  },
  // --- КОНЕЦ НЕИЗМЕНЕННОЙ ЧАСТИ ---

  // --- ГЛАВНОЕ ИЗМЕНЕНИЕ №1: Встраивание критического CSS ---
  // Эта опция автоматически определит стили, нужные для первого экрана,
  // и вставит их прямо в HTML. Это кардинально ускорит FCP и LCP.
  experimental: {
    inlineSSRStyles: true
  },

  // --- ГЛАВНОЕ ИЗМЕНЕНИЕ №2: Правильная загрузка Метрики ---
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-yandex-metrika' // Добавляем модуль сюда
  ],

  yandexMetrika: {
    id: '104348512', // Ваш ID счетчика
    webvisor: true, // Модуль загрузит вебвизор асинхронно, не мешая странице
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    ecommerce: "dataLayer"
    // Модуль по умолчанию использует отложенную загрузку,
    // что идеально для производительности
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ru'
      },
      // --- ГЛАВНОЕ ИЗМЕНЕНИЕ №3: Удаляем старый скрипт Метрики ---
      // Мы полностью удаляем секцию script и noscript для метрики,
      // так как теперь этим управляет модуль `nuxt-yandex-metrika`.
      script: [], // Пустой массив
      noscript: [] // Пустой массив
    }
  },

  site: {
    url: 'https://всепособия.рф'
  },
  
  sitemap: {
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

