export default defineEventHandler(async (event) => {
  // Пробуем несколько внешних API последовательно
  const apisToTry = [
    'https://ipwho.is/',
    'https://ipapi.co/json/',
    'https://ipinfo.io/json?token=YOUR_TOKEN' // Нужен бесплатный токен
  ]
  
  for (const apiUrl of apisToTry) {
    try {
      const response = await fetch(apiUrl)
      const data = await response.json()
      
      if (data.region || data.region_name) {
        return {
          region: data.region || data.region_name,
          city: data.city,
          country: data.country,
          source: apiUrl // Для отладки
        }
      }
    } catch (error) {
      console.error(`Ошибка запроса к ${apiUrl}:`, error)
    }
  }
  
  // Если все API не ответили, пробуем определить по IP на сервере
  try {
    const ip = event.node.req.headers['x-forwarded-for'] || event.node.req.socket.remoteAddress
    return {
      region: getRegionByIp(ip),
      source: 'fallback'
    }
  } catch (error) {
    return { error: 'Не удалось определить регион' }
  }
})

function getRegionByIp(ip) {
  // Простейшая реализация - можно подключить базу данных GeoIP
  if (ip.startsWith('77.')) return 'Москва'
  if (ip.startsWith('178.')) return 'Санкт-Петербург'
  return null
}