export default defineNuxtConfig({
  devtools: { enabled: false }, // Отключить в продакшене
  
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  
  css: ['~/assets/scss/global.scss'],
  
  // Экспериментальные оптимизации
  experimental: {
    payloadExtraction: false, // Уменьшает размер HTML
    inlineSSRStyles: false, // Вынос стилей в отдельные файлы
    renderJsonPayloads: true,
    viewTransition: true
  },

  // Оптимизация производительности
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false
    },
    compressPublicAssets: true, // Сжатие статики
    minify: true
  },

  // Оптимизация Vite
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '' // Добавьте общие миксины/переменные если нужно
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router']
          }
        }
      }
    }
  },

  routeRules: {
    '/**': { 
      prerender: true,
      headers: {
        'cache-control': 's-maxage=31536000' // Кеширование на год для статики
      }
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
      cors: true,
      headers: {
        'cache-control': 's-maxage=300' // 5 минут для API
      }
    },
    
    // Долгосрочное кеширование для статических ресурсов
    '/_nuxt/**': {
      headers: {
        'cache-control': 'public, max-age=31536000, immutable'
      }
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ru'
      },
      // Добавляем preconnect для Яндекс Метрики
      link: [
        {
          rel: 'preconnect',
          href: 'https://mc.yandex.ru'
        },
        {
          rel: 'dns-prefetch',
          href: 'https://mc.yandex.ru'
        }
      ]
    }
  },

  // Добавляем оптимизированные модули
  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/image', // Для оптимизации изображений
    '@nuxtjs/fontaine', // Для оптимизации загрузки шрифтов
    '@nuxtjs/critters' // Для инлайна критических CSS
  ],

  // Конфигурация для @nuxt/image
  image: {
    quality: 80,
    formats: ['webp', 'avif', 'jpeg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

  // Конфигурация для Fontaine (оптимизация шрифтов)
  fontMetrics: {
    fonts: ['Inter', 'Roboto']
  },

  // Конфигурация для Critters (критический CSS)
  critters: {
    config: {
      preload: 'swap'
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
  },

  // Отложенная загрузка компонентов
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false
      }
    ]
  },

  // Оптимизация рендеринга
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  }
})
