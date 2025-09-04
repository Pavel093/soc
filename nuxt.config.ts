import { regions } from './data/regions.js'
import { getAllSlugs } from './data/calculatorPages.js'

export default defineNuxtConfig({
  devtools: { enabled: false },
  
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  
  css: ['~/assets/scss/global.scss'],
  
  nitro: {
    prerender: {
      routes: [
        '/',
        '/edinoe-posobie',
        '/edinoe-posobie/calculator',
        '/edinoe-posobie/calculator/beremennym',
        '/edinoe-posobie/calculator/detyam',
        
        // Страницы для регионов
        ...regions.flatMap(region => [
          `/edinoe-posobie/calculator/beremennym/${region.code}`,
          `/edinoe-posobie/calculator/detyam/${region.code}`
        ]),
        
        // Все новые тематические страницы
        ...getAllSlugs().map(slug => `/edinoe-posobie/calculator/${slug}`)
      ]
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ru'
      }
    }
  },

  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  site: {
    url: 'https://your-domain.ru' // ЗАМЕНИТЕ на ваш реальный домен
  },

  sitemap: {
    sources: ['/api/sitemap']
  },

  robots: {
    rules: {
      UserAgent: '*',
      Allow: '/',
      Sitemap: 'https://your-domain.ru/sitemap.xml' // ЗАМЕНИТЕ на ваш реальный домен
    }
  }
})
