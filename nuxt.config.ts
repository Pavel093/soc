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
  compatibilityDate: '2025-07-15',
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
      external: ['gray-matter'],
      inline: ['markdown-it']
    },
    nodeModulesDirs: ['node_modules']
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
        { rel: 'preconnect', href: 'https://mc.yandex.ru' },
        { rel: 'preconnect', href: 'https://www.googletagmanager.com' } // добавлено
      ],
      script: [
        // Google Tag Manager
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W94MZW8L');`,
          type: 'text/javascript',
          tagPosition: 'head'
        }
      ],
      noscript: [
        {
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/104348512" style="position:absolute; left:-9999px;" alt="" /></div>'
        },
        // Google Tag Manager (noscript)
        {
          innerHTML: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W94MZW8L" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
          tagPosition: 'bodyOpen'
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