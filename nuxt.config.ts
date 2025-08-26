import { regions } from './data/regions.js'

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  css: ['~/assets/scss/global.scss'],
  
  nitro: {
    prerender: {
      routes: [
        '/',
        '/edinoe-posobie',
        '/edinoe-posobie/calculator',
        '/edinoe-posobie/calculator/beremennym',
        '/edinoe-posobie/calculator/detyam',
        ...regions.flatMap(region => [
          `/edinoe-posobie/calculator/beremennym/${region.code}`,
          `/edinoe-posobie/calculator/detyam/${region.code}`
        ])
      ]
    }
  },

  // SEO
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ru'
      }
    }
  },

  // Модули
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  // Настройки sitemap
  site: {
    url: 'https://your-domain.ru' 
  },

  sitemap: {
    sources: ['/api/sitemap.ts']
  },

  // Robots.txt
  robots: {
    rules: {
      UserAgent: '*',
      Allow: '/',
      Sitemap: 'https://your-domain.ru/sitemap.xml'
    }
  }
})
