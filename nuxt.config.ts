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
      script: [
        {
          innerHTML: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js','ym');

            ym(104348512, 'init', {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              ecommerce:"dataLayer"
            });
          `,
          type: 'text/javascript'
        }
      ],
      noscript: [
        {
          innerHTML: '<div><img src="https://mc.yandex.ru/watch/104348512" style="position:absolute; left:-9999px;" alt="" /></div>'
        }
      ],
      __dangerouslyDisableSanitizersByTagID: {
        'yandex-metrika-script': ['innerHTML'],
        'yandex-metrika-noscript': ['innerHTML']
      }
    }
  },

  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  site: {
    url: 'https://xn--90abjn2aafod7l.xn--p1ai'
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
      Sitemap: 'https://xn--90abjn2aafod7l.xn--p1ai/sitemap.xml'
    }
  }
})
