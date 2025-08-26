import { regions } from '../data/regions'

const regionMapping = {
  'Moscow': 'moscow',
  'Moskva': 'moscow',
  'Saint Petersburg': 'spb',
  'Sankt-Peterburg': 'spb',
  'St. Petersburg': 'spb',
  'Moscow Oblast': 'moscow_obl',
  'Perm Krai': 'perm',
  'Perm': 'perm',
  'Krasnodar Krai': 'krasnodar',
  'Sverdlovsk Oblast': 'sverdlovsk',
  'Yekaterinburg': 'sverdlovsk',
  'Novosibirsk': 'novosibirsk',
  'Krasnoyarsk': 'krasnoyarsk',
  'Khabarovsk': 'khabarovsk',
  'Vladivostok': 'primorye',
  'Magadan': 'magadan',
  'Kamchatka': 'kamchatka',
  'Sakhalin': 'sakhalin',
  'Irkutsk': 'irkutsk',
  'Tatarstan': 'tatarstan',
  'Bashkortostan': 'bashkortostan',
  'Dagestan': 'dagestan',
  'Udmurtia': 'udmurtia',
  'Chuvashia': 'chuvashia',
  'Mordovia': 'mordovia',
  'Chechnya': 'chechnya',
  'Ingushetia': 'ingushetia',
  'North Ossetia': 'osetia',
  'Crimea': 'crimea',
  'Sakha': 'sakha',
  'Altai': 'altai_rep',
  'Tyva': 'tuva',
  'Karelia': 'karelia',
  'Komi': 'komi',
  'Mari El': 'mari_el',
   'Khakassia': 'khakassia',
  'Sevastopol': 'sevastopol',
  'Khanty-Mansi': 'khanty_mansi',
  'Yamalo-Nenets': 'yamal',
  'Chukotka': 'chukotka',
  'Nenets': 'nenets',
  'Donetsk': 'donetsk',
  'Luhansk': 'lugansk',
  'Lugansk': 'lugansk',
  'Kherson': 'kherson',
  'Zaporizhzhia': 'zaporozhye',
  'Zaporozhye': 'zaporozhye'
}

// Маппинг часовых поясов на регионы
const timezoneMapping = {
  'Europe/Moscow': 'moscow',
  'Europe/Simferopol': 'crimea',
  'Europe/Kirov': 'kirov',
  'Europe/Volgograd': 'volgograd',
  'Europe/Saratov': 'saratov',
  'Europe/Ulyanovsk': 'ulyanovsk',
  'Europe/Samara': 'samara',
  'Asia/Yekaterinburg': 'sverdlovsk',
  'Asia/Omsk': 'omsk',
  'Asia/Novosibirsk': 'novosibirsk',
  'Asia/Barnaul': 'altai_krai',
  'Asia/Krasnoyarsk': 'krasnoyarsk',
  'Asia/Irkutsk': 'irkutsk',
  'Asia/Chita': 'zabaykalsk',
  'Asia/Yakutsk': 'sakha',
  'Asia/Vladivostok': 'primorye',
  'Asia/Magadan': 'magadan',
  'Asia/Sakhalin': 'sakhalin',
  'Asia/Kamchatka': 'kamchatka',
  'Asia/Anadyr': 'chukotka'
}

// API провайдеры для определения региона
const ipApiProviders = [
  {
    name: 'ipwhois.io',
    url: 'https://ipwho.is/',
    regionPath: ['region', 'city'],
    errorPath: ['error']
  },
  {
    name: 'IP-API',
    url: 'https://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city',
    regionPath: ['regionName', 'city'],
    errorPath: ['message']
  },
  {
    name: 'FreeGeoIP',
    url: 'https://freegeoip.app/json/',
    regionPath: ['region_name', 'city'],
    errorPath: ['error']
  }
]

// Нормализация названия региона
function normalizeRegionName(regionName) {
  if (!regionName) return null
  
  // Проверяем прямое соответствие в маппинге
  if (regionMapping[regionName]) {
    return regionMapping[regionName]
  }
  
  // Проверяем без учета регистра
  const lowerRegion = regionName.toLowerCase()
  for (const [key, value] of Object.entries(regionMapping)) {
    if (key.toLowerCase() === lowerRegion) {
      return value
    }
  }
  
  // Ищем частичное совпадение
  for (const [key, value] of Object.entries(regionMapping)) {
    if (lowerRegion.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerRegion)) {
      return value
    }
  }
  
  return null
}

// Определение региона по часовому поясу
function getRegionByTimezone() {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return timezoneMapping[timezone] || null
  } catch (error) {
    console.error('Ошибка определения часового пояса:', error)
    return null
  }
}

// Запрос к API
async function fetchApi(api) {
  try {
    const response = await fetch(api.url)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const data = await response.json()
    
    if (api.errorPath && api.errorPath.some(path => data[path])) {
      const errorMsg = api.errorPath.map(path => data[path]).find(Boolean)
      throw new Error(errorMsg || 'Unknown error from API')
    }
    
    return data
  } catch (error) {
    console.error(`Ошибка при запросе к ${api.name}:`, error)
    throw error
  }
}

// Основная функция определения региона по IP
export async function detectRegionByIP() {
  // Пробуем все API по очереди
  for (const api of ipApiProviders) {
    try {
      const data = await fetchApi(api)
      console.log(`Данные от ${api.name}:`, data)
      
      // Проверяем все возможные пути к данным о регионе
      for (const path of api.regionPath) {
        const rawRegion = path.split('.').reduce((obj, key) => obj?.[key], data)
        if (!rawRegion) continue
        
        // Нормализуем название региона
        const normalizedCode = normalizeRegionName(rawRegion)
        if (normalizedCode) {
          return normalizedCode
        }
      }
    } catch (error) {
      console.warn(`Не удалось получить данные от ${api.name}:`, error)
      continue
    }
  }
  
  // Если API не дали результат, пробуем определить по часовому поясу
  const timezoneRegion = getRegionByTimezone()
  if (timezoneRegion) {
    return timezoneRegion
  }
  
  // Возвращаем null если ничего не нашли
  return null
}