<template>
  <div class="calculator-seo-wrapper">
    <!-- SEO текст для поисковиков -->
    <div class="seo-content">
      <h1>{{ seoData.title }}</h1>
      <p>{{ seoData.description }}</p>
    </div>
    
    <!-- Основной калькулятор (тот же, что и везде) -->
    <SmartCalculator />
    
    <!-- Дополнительный SEO контент -->
    <div class="seo-footer">
      <h2>Прожиточный минимум в {{ currentRegion?.name }}</h2>
      <ul>
        <li>Общий: {{ currentRegion?.pmValue?.toLocaleString('ru-RU') }} ₽</li>
        <li>Для трудоспособных: {{ currentRegion?.pmWorking?.toLocaleString('ru-RU') }} ₽</li>
        <li>Для детей: {{ currentRegion?.pmChild?.toLocaleString('ru-RU') }} ₽</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { findRegionByCode } from '~/data/regions.js'

const route = useRoute()
const currentRegion = findRegionByCode(route.params.region)

// Если регион не найден - показываем общую страницу
if (!currentRegion) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Регион не найден'
  })
}

// SEO данные для беременных
const seoData = {
  title: `Калькулятор единого пособия для беременных в ${currentRegion.name} в 2025 году`,
  description: `Рассчитайте размер единого пособия для беременных женщин в ${currentRegion.name}. Прожиточный минимум в регионе составляет ${currentRegion.pmValue.toLocaleString('ru-RU')} рублей.`
}

// SEO мета-теги
useSeoMeta({
  title: seoData.title,
  description: seoData.description,
  ogTitle: `Единое пособие беременным - ${currentRegion.name}`,
  keywords: `единое пособие, беременным, ${currentRegion.name}, калькулятор, 2025`
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