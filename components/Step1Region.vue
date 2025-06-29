<script setup>
import { pmData } from '../utils/pmData'
import { useCalculatorStore } from '../stores/calculatorStore'
import { ref, onMounted, computed } from 'vue'

const store = useCalculatorStore()
const isDetectingRegion = ref(false)
const geoError = ref(null)

// Связываем region с store.region напрямую
const region = computed({
  get: () => store.region,
  set: val => store.region = val
})

// Маппинг для нормализации названий регионов из API
const regionMapping = {
  'Perm Krai': 'Пермский край',
  'Moscow Oblast': 'Московская область',
  'Saint Petersburg': 'Санкт-Петербург',
  'Krasnodar Krai': 'Краснодарский край',
  'Permskiy kray': 'Пермский край',
  'Moskva': 'Москва',
  'Sankt-Peterburg': 'Санкт-Петербург',
  // Добавьте другие маппинги при необходимости
}

// Нормализация названия региона
const normalizeRegionName = (region) => {
  if (!region) return null

  // Применяем маппинг
  if (regionMapping[region]) {
    return regionMapping[region]
  }

  // Если нет в маппинге, пытаемся подобрать подходящее название
  const normalized = region
    .replace('г. ', '')
    .replace('Республика ', '')
    .replace('область', '')
    .replace('край', '')
    .replace('Federal City', '')
    .trim()

  return normalized
}

// Поиск точного совпадения или варианта с суффиксом
const findRegionInData = (regionName) => {
  if (!regionName) return null

  // Проверяем точное совпадение
  if (pmData[regionName]) return regionName

  // Попробуем добавить суффиксы
  const variants = [
    `${regionName} область`,
    `${regionName} край`,
    `Республика ${regionName}`,
    `г. ${regionName}`
  ]

  for (const variant of variants) {
    if (pmData[variant]) return variant
  }

  // Попробуем найти частичное совпадение
  for (const knownRegion in pmData) {
    if (knownRegion.includes(regionName) || regionName.includes(knownRegion)) {
      return knownRegion
    }
  }

  return null
}

// Определение региона по часовому поясу
const getRegionByTimezone = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.includes('Moscow')) return 'Москва'
    if (timezone.includes('Saint_Petersburg')) return 'Санкт-Петербург'
    if (timezone.includes('Asia/Novosibirsk')) return 'Новосибирская область'
    if (timezone.includes('Asia/Yekaterinburg')) return 'Свердловская область'
    if (timezone.includes('Asia/Krasnoyarsk')) return 'Красноярский край'
    return null
  } catch {
    return null
  }
}

// Список API для определения местоположения по IP
const ipApiProviders = [
  {
    name: 'ipapi.co',
    url: 'https://ipapi.co/json/',
    regionPath: ['region', 'region_name']
  },
  {
    name: 'ip-api.com',
    url: 'http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query',
    regionPath: ['regionName', 'city'],
    errorPath: ['message']
  },
  {
    name: 'ipinfo.io',
    url: 'https://ipinfo.io/json?token=free',
    regionPath: ['region', 'city'],
    errorPath: ['error']
  },
  {
    name: 'geolocation-db.com',
    url: 'https://geolocation-db.com/json/',
    regionPath: ['state', 'city']
  }
]

// Функция для запроса к API
async function fetchApi(api) {
  try {
    const response = await fetch(api.url)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const data = await response.json()
    
    // Проверяем наличие ошибки
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

// Функция определения региона через IP или часовой пояс
async function detectRegion() {
  isDetectingRegion.value = true
  geoError.value = null
  
  // Пробуем все API по очереди
  for (const api of ipApiProviders) {
    try {
      const data = await fetchApi(api)
      console.log(`Данные от ${api.name}:`, data)
      
      // Пробуем разные поля с регионом
      const possibleRegions = api.regionPath
        .map(path => {
          const value = path.split('.').reduce((obj, key) => obj?.[key], data)
          return value && typeof value === 'string' ? value : null
        })
        .filter(Boolean)
      
      // Ищем первое подходящее название
      for (const rawRegion of possibleRegions) {
        const normalized = normalizeRegionName(rawRegion)
        const foundRegion = findRegionInData(normalized)
        if (foundRegion) {
          console.log(`Регион определен через ${api.name}:`, foundRegion)
          return foundRegion
        }
      }
    } catch (error) {
      console.warn(`Не удалось получить данные от ${api.name}:`, error)
      continue
    }
  }
  
  // Если API не вернули регион, пробуем по часовому поясу
  try {
    const timezoneRegion = getRegionByTimezone()
    if (timezoneRegion) {
      console.warn('Используем регион по часовому поясу:', timezoneRegion)
      return timezoneRegion
    }
  } catch (error) {
    console.error('Ошибка определения по часовому поясу:', error)
  }
  
  throw new Error('Не удалось определить регион')
}

onMounted(async () => {
  if (store.region) return
  
  try {
    const detectedRegion = await detectRegion()
    if (detectedRegion) {
      region.value = detectedRegion
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
  <div>
    <h2>1. Регион проживания</h2>
    <select v-model="region">
      <option disabled value="">Выберите регион</option>
      <option v-for="(value, key) in pmData" :key="key" :value="key">
        {{ key }} (ПМ: {{ value }} руб.)
      </option>
    </select>
    <div v-if="isDetectingRegion" class="loading-message">
      Определяем ваш регион...
    </div>
    <div v-if="geoError" class="error-message">
      {{ geoError }}
    </div>
    <div v-if="region" class="current-region">
      Текущий регион: <strong>{{ region }}</strong>
    </div>
  </div>
</template>

<style scoped>
.error-message {
  color: #d32f2f;
  margin-top: 8px;
}
.loading-message {
  color: #1976d2;
  margin-top: 8px;
}
.current-region {
  margin-top: 8px;
  color: #388e3c;
}
</style>