<script setup>
import { pmData } from '../utils/pmData'
import { useCalculatorStore } from '../stores/calculatorStore'
import { ref, onMounted, computed } from 'vue'

const store = useCalculatorStore()
const isDetectingRegion = ref(false)

const region = computed({
  get: () => store.region,
  set: val => store.region = val
})

async function detectRegion() {
  try {
    // Используем $fetch вместо fetch для корректной работы с SSR
    const data = await $fetch('/api/ipinfo') // Обращаемся к нашему middleware
    
    // Проверяем разные возможные поля, где может быть регион
    const region = data.region || data.region_name || data.federal_district
    
    // Если API вернул город (например, Москва), проверяем есть ли он в pmData
    if (region && pmData[region]) {
      return region
    }
    
    // Если город не найден, проверяем область/край
    const regionWithSuffix = `${region} область`
    if (region && pmData[regionWithSuffix]) {
      return regionWithSuffix
    }
    
    return null
  } catch (error) {
    console.error('Ошибка при определении региона:', error)
    return null
  }
}

onMounted(async () => {
  // Если регион уже выбран, не определяем автоматически
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
    <p v-if="isDetectingRegion">Определяем ваш регион...</p>
  </div>
</template>