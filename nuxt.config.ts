import { regions } from './data/regions.js'
import { getAllSlugs } from './data/calculatorPages.js'

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
    },
    externals: {
      inline: ['gray-matter', 'markdown-it']
    }
  },

  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  routeRules: {
    '/**': { 
      prerender: true 
    },
    '/embed': { 
      prerender: false, 
      ssr: true 
    },
    '/admin': { 
      prerender: false, 
      ssr: true 
    },
    '/admin/**': { 
      prerender: false, 
      ssr: true 
    },
    '/api/**': { 
      prerender: false,
      cors: true
    },
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

  site: {
    url: 'https://всепособия.рф'
  },

  sitemap: {
    sources: ['/api/sitemap'],
    exclude: [
      '/admin',
      '/admin/**',
      '/embed',
      '/embed/**',
      ...devRoutes
    ]
  },

  robots: {
    rules: {
      UserAgent: '*',
      Allow: '/',
      Disallow: [
        '/admin', 
        '/embed',
        ...devRoutes
      ],
      Sitemap: 'https://всепособия.рф/sitemap.xml'
    }
  }
})