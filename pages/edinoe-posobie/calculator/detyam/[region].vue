<template>
  <div class="calculator-seo-wrapper">
    <!-- SEO текст для поисковиков -->
    <div class="seo-content">
      <h1>{{ seoData.title }}</h1>
      <p>{{ seoData.description }}</p>
    </div>
    
    <!-- Основной калькулятор (тот же самый) -->
    <SmartCalculator />
    
    <!-- Дополнительный SEO контент -->
    <div class="seo-footer">
      <h2>Прожиточный минимум в {{ currentRegion?.name }}</h2>
      <ul>
        <li>На душу населения: {{ currentRegion?.pmValue?.toLocaleString('ru-RU') }} ₽</li>
        <li>Для детей: {{ currentRegion?.pmChild?.toLocaleString('ru-RU') }} ₽</li>
        <li>Для трудоспособных: {{ currentRegion?.pmWorking?.toLocaleString('ru-RU') }} ₽</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { findRegionByCode } from '~/data/regions.js'

const route = useRoute()
const currentRegion = findRegionByCode(route.params.region)

if (!currentRegion) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Регион не найден'
  })
}

// SEO данные для детей
const seoData = {
  title: `Калькулятор единого пособия на детей в ${currentRegion.name} в 2025 году`,
  description: `Рассчитайте размер единого пособия на детей до 17 лет в ${currentRegion.name}. Прожиточный минимум на ребенка составляет ${currentRegion.pmChild.toLocaleString('ru-RU')} рублей.`
}

// SEO мета-теги
useSeoMeta({
  title: seoData.title,
  description: seoData.description,
  ogTitle: `Единое пособие на детей - ${currentRegion.name}`,
  keywords: `единое пособие, детские пособия, ${currentRegion.name}, калькулятор, 2025`
})
</script>

<style scoped>
.seo-content {
  margin-bottom: 30px;
}

.seo-content h1 {
  font-size: 28px;
  margin-bottom: 15px;
}

.seo-footer {
  margin-top: 40px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}
</style>