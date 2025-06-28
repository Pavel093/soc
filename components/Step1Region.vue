<script setup>
import { pmData } from '../utils/pmData'
import { useCalculatorStore } from '../stores/calculatorStore'
import { ref, onMounted, computed } from 'vue'

const store = useCalculatorStore()
const isDetectingRegion = ref(false)

const region = computed({
  get: () => store.region,
  set: val => store.setRegion(val) // Используем action из хранилища
})

// Функция для нормализации названия региона
const normalizeRegionName = (region) => {
  if (!region) return null
  
  return region
    .replace('г. ', '')
    .replace('Республика ', '')
    .replace('область', '')
    .replace('край', '')
    .replace('автономный округ', '')
    .trim()
}

// Функция для поиска региона в pmData
const findRegionInData = (regionName) => {
  if (!regionName) return null
  
  // Проверяем точное совпадение
  if (pmData[regionName]) return regionName
  
  // Проверяем варианты с разными суффиксами
  const variants = [
    regionName,
    `${regionName} область`,
    `${regionName} край`,
    `Республика ${regionName}`,
    `г. ${regionName}`
  ]
  
  return variants.find(v => pmData[v]) || null
}

async function detectRegion() {
  try {
    const data = await $fetch('/api/ipinfo')
    console.log('Данные от API:', data)
    
    const rawRegion = data.region || data.region_name || data.federal_district
    if (!rawRegion) {
      console.warn('API не вернул название региона')
      return null
    }
    
    // Нормализуем название региона
    const normalized = normalizeRegionName(rawRegion)
    console.log('Нормализованное название:', normalized)
    
    // Ищем регион в данных
    const foundRegion = findRegionInData(normalized)
    
    if (foundRegion) {
      console.log('Найден регион:', foundRegion)
      return foundRegion
    }
    
    console.warn('Регион не найден в pmData. Доступные регионы:', Object.keys(pmData))
    return null
  } catch (error) {
    console.error('Ошибка при определении региона:', error)
    return null
  }
}

onMounted(async () => {
  if (store.region) {
    console.log('Регион уже выбран:', store.region)
    return
  }
  
  isDetectingRegion.value = true
  try {
    const detectedRegion = await detectRegion()
    if (detectedRegion) {
      region.value = detectedRegion
      console.log('Автоматически установлен регион:', detectedRegion)
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
    <p v-if="isDetectingRegion">Определяем ваш регион...</p>
    <p v-if="region">Текущий регион: {{ region }}</p>
  </div>
</template>