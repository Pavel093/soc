export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', async (error, { event }) => {
    // Логирование ошибок
    console.error(`[Error ${error.statusCode || 500}] ${event.node.req.url}:`, error.message)
    
    // Установка правильного статус кода
    if (error.statusCode) {
      setResponseStatus(event, error.statusCode)
    }
    
    // Дополнительные заголовки для 404
    if (error.statusCode === 404) {
      setHeader(event, 'cache-control', 'no-cache, no-store, must-revalidate')
    }
  })
  
  nitroApp.hooks.hook('beforeResponse', async (event) => {
    // Проверяем, существует ли роут
    const url = event.node.req.url
    
    // Список игнорируемых путей
    const ignorePaths = [
      '/_nuxt',
      '/api',
      '/__nuxt',
      '/favicon.ico',
      '/favicon.svg',
    ]
    
    // Не проверяем служебные пути
    if (ignorePaths.some(path => url?.startsWith(path))) {
      return
    }
    
    // Если страница не найдена, устанавливаем 404
    if (!event.node.res.statusCode || event.node.res.statusCode === 404) {
      setResponseStatus(event, 404)
    }
  })
})
