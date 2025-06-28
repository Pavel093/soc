export default defineEventHandler(async (event) => {
  // Получаем реальный IP клиента (с учётом прокси)
  const getClientIp = (req) => {
    const xForwardedFor = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    return xForwardedFor || req.socket?.remoteAddress
  }
  const clientIp = getClientIp(event.node.req)

  // Если IP есть, используем его для определения локации
  if (clientIp) {
    const apisToTry = [
      `https://ipwho.is/${clientIp}`,
      `https://ipapi.co/${clientIp}/json/`,
      `https://ipinfo.io/${clientIp}/json?token=YOUR_TOKEN`
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
            source: apiUrl
          }
        }
      } catch (error) {
        console.error(`Ошибка запроса к ${apiUrl}:`, error)
      }
    }
  }

  // Фолбэк, если не удалось определить
  return { error: 'Не удалось определить регион' }
})