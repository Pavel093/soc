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

  return null
}

// Определение региона по часовому поясу
const getRegionByTimezone = () => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.includes('Moscow')) return 'Москва'
    if (timezone.includes('Saint_Petersburg')) return 'Санкт-Петербург'
    if (timezone.includes('Asia/Novosibirsk')) return 'Новосибирская область'
    return null
  } catch {
    return null
  }
}

// Функция определения региона через IP или часовой пояс
async function detectRegion() {
  try {
    // Пробуем получить данные от API
    const apiResponse = await $fetch('/api/ipinfo')
    console.log('API Response:', apiResponse)
    if (apiResponse.error) throw new Error(apiResponse.error)

    // Пробуем разные поля с регионом
    const possibleRegions = [
      apiResponse.region,
      apiResponse.region_name,
      apiResponse.city,
      apiResponse.country === 'Russia' ? 'Москва' : null
    ].filter(Boolean)

    // Ищем первое подходящее название
    for (const rawRegion of possibleRegions) {
      const normalized = normalizeRegionName(rawRegion)
      const foundRegion = findRegionInData(normalized)
      if (foundRegion) return foundRegion
    }

    // Если API не вернул регион, пробуем по часовому поясу
    const timezoneRegion = getRegionByTimezone()
    if (timezoneRegion) {
      console.warn('Используем регион по часовому поясу:', timezoneRegion)
      return timezoneRegion
    }

    throw new Error('Не удалось определить регион')
  } catch (error) {
    console.error('Ошибка определения региона:', error)
    geoError.value = 'Не удалось автоматически определить ваш регион. Пожалуйста, выберите вручную.'
    return null
  }
}

onMounted(async () => {
  if (store.region) return
  isDetectingRegion.value = true
  try {
    const detectedRegion = await detectRegion()
    if (detectedRegion) {
      region.value = detectedRegion
    }
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