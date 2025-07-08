<script setup>
import { pmData } from '../utils/pmData'
import { useCalculatorStore } from '../stores/calculatorStore'
import { ref, onMounted, computed } from 'vue'

const store = useCalculatorStore()
const isDetectingRegion = ref(false)
const geoError = ref(null)
const isAutoDetected = ref(false)

const region = computed({
  get: () => store.region,
  set: val => {
    store.region = val
    isAutoDetected.value = false
  }
})

// Полный маппинг для нормализации названий регионов
const regionMapping = {
  // Английские и альтернативные названия
  'Perm Krai': 'Пермский край',
  'Moscow Oblast': 'Московская область',
  'Saint Petersburg': 'Санкт-Петербург',
  'Krasnodar Krai': 'Краснодарский край',
  'Permskiy kray': 'Пермский край',
  'Moskva': 'Москва',
  'Sankt-Peterburg': 'Санкт-Петербург',
  'Perm': 'Пермский край',
  'Moscow': 'Москва',
  'St. Petersburg': 'Санкт-Петербург',
  'St Petersburg': 'Санкт-Петербург',
  'SPb': 'Санкт-Петербург',
  
  // Регионы из часовых поясов
  'Novosibirsk': 'Новосибирская область',
  'Yekaterinburg': 'Свердловская область',
  'Krasnoyarsk': 'Красноярский край',
  'Khabarovsk': 'Хабаровский край',
  'Vladivostok': 'Приморский край',
  'Magadan': 'Магаданская область',
  'Kamchatka': 'Камчатский край',
  'Sakhalin': 'Сахалинская область',
  'Irkutsk': 'Иркутская область',
  
  // Альтернативные написания республик
  'Tatarstan': 'Республика Татарстан',
  'Bashkortostan': 'Республика Башкортостан',
  'Dagestan': 'Республика Дагестан',
  'Udmurtia': 'Удмуртская Республика',
  'Chuvashia': 'Чувашская Республика',
  'Mordovia': 'Республика Мордовия',
  'Chechnya': 'Чеченская Республика',
  'Ingushetia': 'Республика Ингушетия',
  'North Ossetia': 'Республика Северная Осетия — Алания',
  'Crimea': 'Республика Крым',
  'Sakha': 'Республика Саха (Якутия)',
  'Altai': 'Республика Алтай',
  'Tyva': 'Республика Тыва',
  'Karelia': 'Республика Карелия',
  'Komi': 'Республика Коми',
  'Mari El': 'Республика Марий Эл',
  'Khakassia': 'Республика Хакасия',
  
  // Города федерального значения
  'Sevastopol': 'Севастополь',
  
  // Автономные округа
  'Khanty-Mansi': 'Ханты-Мансийский автономный округ — Югра',
  'Yamalo-Nenets': 'Ямало-Ненецкий автономный округ',
  'Chukotka': 'Чукотский автономный округ',
  'Nenets': 'Ненецкий автономный округ',
  
  // Новые регионы
  'Donetsk': 'Донецкая Народная Республика',
  'Luhansk': 'Луганская Народная Республика',
  'Kherson': 'Херсонская область',
  'Zaporizhzhia': 'Запорожская область'
}

const normalizeRegionName = (region) => {
  if (!region) return null

  // Приводим к нижнему регистру для сравнения
  const lowerRegion = region.toLowerCase()
  
  // Сначала проверяем точное соответствие в маппинге
  if (regionMapping[region]) {
    return regionMapping[region]
  }

  // Проверяем маппинг без учета регистра
  for (const key in regionMapping) {
    if (key.toLowerCase() === lowerRegion) {
      return regionMapping[key]
    }
  }

  // Удаляем лишние слова и приводим к стандартному виду
  let normalized = region
    .replace(/г\.?/i, '')
    .replace(/город/i, '')
    .replace(/республика/i, '')
    .replace(/область/i, '')
    .replace(/край/i, '')
    .replace(/federal city/i, '')
    .replace(/city/i, '')
    .replace(/autonomous okrug/i, '')
    .replace(/republic/i, '')
    .replace(/['"]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Проверяем, есть ли регион в pmData как есть
  if (pmData[normalized]) {
    return normalized
  }

  // Проверяем варианты с добавлением "область", "край" и т.д.
  const variants = [
    `${normalized} область`,
    `${normalized} край`,
    `Республика ${normalized}`,
    `г. ${normalized}`
  ]

  for (const variant of variants) {
    if (pmData[variant]) return variant
  }

  return normalized
}

const findRegionInData = (regionName) => {
  if (!regionName) return null

  // Проверяем точное совпадение
  if (pmData[regionName]) return regionName

  // Ищем частичное совпадение
  const lowerRegionName = regionName.toLowerCase()
  
  // Сначала проверяем начало названия
  for (const knownRegion in pmData) {
    if (knownRegion.toLowerCase().startsWith(lowerRegionName)) {
      return knownRegion
    }
  }
  
  // Затем проверяем вхождение в любом месте названия
  for (const knownRegion in pmData) {
    if (knownRegion.toLowerCase().includes(lowerRegionName)) {
      return knownRegion
    }
  }

  // Проверяем обратное вхождение (известный регион в переданном названии)
  for (const knownRegion in pmData) {
    const lowerKnownRegion = knownRegion.toLowerCase()
    if (lowerRegionName.includes(lowerKnownRegion)) {
      return knownRegion
    }
  }

  return null
}

const getRegionByTimezone = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timezoneMapping = {
      'Europe/Moscow': 'Москва',
      'Europe/Simferopol': 'Республика Крым',
      'Europe/Kirov': 'Кировская область',
      'Europe/Volgograd': 'Волгоградская область',
      'Europe/Saratov': 'Саратовская область',
      'Europe/Ulyanovsk': 'Ульяновская область',
      'Europe/Samara': 'Самарская область',
      'Asia/Yekaterinburg': 'Свердловская область',
      'Asia/Omsk': 'Омская область',
      'Asia/Novosibirsk': 'Новосибирская область',
      'Asia/Barnaul': 'Алтайский край',
      'Asia/Krasnoyarsk': 'Красноярский край',
      'Asia/Irkutsk': 'Иркутская область',
      'Asia/Chita': 'Забайкальский край',
      'Asia/Yakutsk': 'Республика Саха (Якутия)',
      'Asia/Vladivostok': 'Приморский край',
      'Asia/Magadan': 'Магаданская область',
      'Asia/Sakhalin': 'Сахалинская область',
      'Asia/Kamchatka': 'Камчатский край',
      'Asia/Anadyr': 'Чукотский автономный округ'
    }
    
    return timezoneMapping[timezone] || null
  } catch {
    return null
  }
}

const ipApiProviders = [
  {
    name: 'ipwhois.io',
    url: 'https://ipwho.is/',
    regionPath: ['region', 'city'],
    errorPath: ['error']
  },
  {
    name: 'IP-API',
    url: 'http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city',
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

async function detectRegion() {
  isDetectingRegion.value = true
  geoError.value = null
  
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
        const normalized = normalizeRegionName(rawRegion)
        // Пытаемся найти в наших данных
        const foundRegion = findRegionInData(normalized)
        
        if (foundRegion) {
          isAutoDetected.value = true
          return foundRegion
        }
      }
    } catch (error) {
      console.warn(`Не удалось получить данные от ${api.name}:`, error)
      continue
    }
  }
  
  // Если API не дали результат, пробуем определить по часовому поясу
  try {
    const timezoneRegion = getRegionByTimezone()
    if (timezoneRegion) {
      isAutoDetected.value = true
      return timezoneRegion
    }
  } catch (error) {
    console.error('Ошибка определения по часовому поясу:', error)
  }
  
  // Если ничего не помогло, возвращаем null
  return null
}

onMounted(async () => {
  if (store.region) return
  
  try {
    const detectedRegion = await detectRegion()
    if (detectedRegion) {
      region.value = detectedRegion
    } else {
      geoError.value = 'Не удалось автоматически определить ваш регион. Пожалуйста, выберите вручную.'
    }
  } catch (error) {
    console.error('Ошибка определения региона:', error)
    geoError.value = 'Не удалось автоматически определить ваш регион. Пожалуйста, выберите вручную.'
  } finally {
    isDetectingRegion.value = false
  }
})
</script>

<template>
  <div class="region-step">
    <h2 class="step-title dark-text">Регион проживания </h2>
    <div class="base-option">
      <div class="select-wrapper">
      <select v-model="region" class="region-select">
        <option disabled value="">Выберите регион</option>
        <option v-for="(value, key) in pmData" :key="key" :value="key">
          {{ key }} (ПМ: {{ value }} руб.)
        </option>
      </select>
      </div>
      <div v-if="isDetectingRegion" class="loading-message light-text">
        Определяем ваш регион...
      </div>
      <div v-if="geoError" class="error-message">
        {{ geoError }}
      </div>
      <div v-if="region" class="current-region light-text">
        Текущий регион: <strong class="dark-text">{{ region }} <span v-if="isAutoDetected">(выбрано автоматически)</span></strong>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.region-step {
  margin-bottom: 20px;
  h2{
    position: absolute;
    top: 15px;
    left: calc(15px + 69px + 15px);
    font-weight: 300;
    font-size: 25px;
    max-width: 90%;
    letter-spacing: 1.02px;
    line-height: 0.9;
  }
  .base-option{
    margin-top: 5%;
  }
}

.step-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.error-message {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #ffebee;
  border-radius: 6px;
  color: #d32f2f;
  font-size: 14px;
}

.loading-message {
  margin-top: 8px;
  font-size: 14px;
}

.current-region {
  margin-top: 8px;
  font-size: 14px;
  color: #7d838b;
}

.current-region strong {
  font-weight: 500;
  color: #7d838b;
}

/* Для мобильных safari */
.region-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>