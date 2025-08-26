<template>
  <div class="regions-list-page">
    <h1>Калькулятор единого пособия для беременных по регионам России</h1>
    <p>Выберите ваш регион для расчета пособия:</p>
    
    <div class="regions-grid">
      <NuxtLink 
        v-for="region in regions"
        :key="region.code"
        :to="`/edinoe-posobie/calculator/beremennym/${region.code}`"
        class="region-link"
      >
        {{ region.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { getRegionsSortedByName } from '~/data/regions.js'

const regions = getRegionsSortedByName()

useSeoMeta({
  title: 'Единое пособие для беременных по регионам России 2025',
  description: 'Калькулятор единого пособия для беременных женщин по всем регионам России. Актуальные данные на 2025 год.'
})
</script>

<style scoped>
.regions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 30px;
}

.region-link {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.region-link:hover {
  background: #e1e4e8;
}
</style>