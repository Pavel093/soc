export default {
  head: {
    title: 'Мой Nuxt-проект',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 
        hid: 'description', 
        name: 'description', 
        content: 'Мой Nuxt.js проект' 
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      }
    ]
  },

  css: [
    '@/assets/scss/global.scss'
  ],

  ssr: true, 
  nitro: {
    preset: 'node-server'
  },

  // app: {
  //   baseURL: '/soc/'
  // },

  modules: ['@pinia/nuxt'],
}