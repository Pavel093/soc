<template>
  <Header />
  <div class="page-container">
    <Breadcrumbs :items="breadcrumbs" />
    <article class="calculator-page">
      <header class="page-intro">
        <h1>{{ title }}</h1>
        <p class="description">{{ description }}</p>
      </header>

      <section class="calculator-block">
        <SmartCalculator />
      </section>

      <aside class="living-wage-summary">
        <h2>Прожиточный минимум в {{ regionGenitive }}</h2>
        <ul class="wage-list">
          <li>
            <strong>На душу населения:</strong>
            <span>{{ currentRegion?.pmValue?.toLocaleString('ru-RU') }} ₽</span>
          </li>
          <li>
            <strong>Для трудоспособных:</strong>
            <span>{{ currentRegion?.pmWorking?.toLocaleString('ru-RU') }} ₽</span>
          </li>
          <li>
            <strong>Для детей:</strong>
            <span>{{ currentRegion?.pmChild?.toLocaleString('ru-RU') }} ₽</span>
          </li>
        </ul>
        <p class="info-note">Данные о прожиточном минимуме используются для определения права на пособие и расчета его размера.</p>
      </aside>
    </article>
  </div>
  <Footer />
</template>

<script setup>
import { findRegionByCode } from '~/data/regions.js'
import Breadcrumbs from '~/components/Breadcrumbs.vue' // <-- Импорт компонента

const route = useRoute()
const currentRegion = findRegionByCode(route.params.region)

if (!currentRegion) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница для данного региона не найдена',
    fatal: true
  })
}

const regionGenitive = currentRegion.nameGenitive || currentRegion.name
const title = `Калькулятор единого пособия на детей в ${regionGenitive} в 2025 году`
const description = `Рассчитайте онлайн размер единого пособия для семей с детьми от 0 до 17 лет в ${regionGenitive}. Актуальный расчет с учетом прожиточного минимума на ребенка в регионе: ${currentRegion.pmChild.toLocaleString('ru-RU')} ₽.`

useSeoMeta({
  title: title,
  description: description,
  ogTitle: `Единое пособие на детей в ${regionGenitive} — Калькулятор 2025`,
  ogDescription: description,
  keywords: `единое пособие, пособие на детей, детские пособия, калькулятор пособий, ${regionGenitive}, 2025, прожиточный минимум`
})

// <-- Формируем массив для хлебных крошек
const breadcrumbs = [
  { text: 'Главная', to: '/' },
  { text: 'Единое пособие', to: '/edinoe-posobie' },
  { text: 'Калькулятор на детей', to: '/edinoe-posobie/calculator/detyam' },
  { text: currentRegion.name } // Последний элемент без ссылки
];
</script>

<style lang="scss" scoped>
// Стили полностью скопированы из компонента для беременных для консистентности
$color-text-primary: #2c3e50;
$color-text-secondary: #5a6b7e;
$color-background-light: #f8f9fa;
$color-border: #e9ecef;
$color-accent-bg: #e9ecef;

// Типографика
$font-size-base: 1rem; // 16px

// Отступы
$spacing-base: 1rem;
$spacing-medium: 1.5rem;
$spacing-large: 2.5rem;

// Границы и скругления
$border-radius: 12px;
$border-base: 1px solid $color-border;

// Точки перехода (Breakpoints) для адаптивности
$breakpoint-md: 768px;

@mixin media-up($breakpoint) {
  @media (min-width: $breakpoint) {
    @content;
  }
}
.calculator-page {
  color: $color-text-primary;
  max-width: 800px;
  margin: 0 auto;
  // На мобильных отступы по бокам меньше
  padding: $spacing-medium $spacing-base;

  // Увеличиваем отступы на больших экранах
  @include media-up($breakpoint-md) {
    padding: $spacing-large $spacing-medium;
  }
}

.page-intro {
  text-align: center;
  margin-bottom: $spacing-large;

  h1 {
    // Адаптивный размер шрифта, который сам подстраивается под ширину экрана
    font-size: clamp(1.75rem, 5vw, 2.25rem);
    line-height: 1.2;
    margin-bottom: 0.75rem;
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.6;
    color: $color-text-secondary;
    max-width: 650px;
    margin: 0 auto;
  }
}

.calculator-block {
  margin-bottom: $spacing-large;
}

.living-wage-summary {
  margin-top: $spacing-large;
  padding: $spacing-medium;
  background: $color-background-light;
  border: $border-base;
  border-radius: $border-radius;

  h2 {
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: $spacing-medium;
    border-bottom: $border-base;
    padding-bottom: $spacing-base;

    @include media-up($breakpoint-md) {
      font-size: 1.5rem;
    }
  }

  .wage-list {
    list-style: none;
    padding: 0;
    margin: 0 0 $spacing-medium 0;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap; // Позволяет переносить элементы на новую строку
      gap: 0.5rem; // Пространство между элементами, если они переносятся
      padding: $spacing-base 0;
      font-size: $font-size-base;
      border-bottom: $border-base;

      &:last-child {
        border-bottom: none;
      }

      strong {
        font-weight: 600;
      }

      span {
        font-weight: 500;
        background-color: $color-accent-bg;
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        white-space: nowrap; // Предотвращает перенос внутри суммы
      }
    }
  }

  .info-note {
    font-size: 0.9rem;
    color: $color-text-secondary;
    text-align: center;
    margin: 0;
    padding-top: $spacing-base;
    border-top: $border-base;
  }
}
</style>