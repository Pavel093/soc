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

<script setup>
import { pmData } from '../utils/pmData'
import { useCalculatorStore } from '../stores/calculatorStore'
import { detectRegion } from '../utils/geoLocation'
import { ref, onMounted, computed } from 'vue'

const store = useCalculatorStore()
const isDetectingRegion = ref(false)

const region = computed({
  get: () => store.region,
  set: val => store.region = val
})

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