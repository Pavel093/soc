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

      <!-- ОБНОВЛЕННОЕ УВЕДОМЛЕНИЕ -->
      <div class="instruction-note-wrapper">
        <div class="instruction-note prominent-notice">
          <div class="notice-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div class="notice-content">
            <h3>Внимание, это важно!</h3>
            <p>После ответа на каждый вопрос <strong>обязательно нажимайте кнопку <span class="button-highlight">«Далее»</span></strong>, чтобы перейти к следующему шагу.</p>
          </div>
        </div>
      </div>

      <!-- ОБНОВЛЕННЫЙ FAQ -->
      <section class="faq-section">
        <div class="faq-wrapper">
          <h2>Часто задаваемые вопросы</h2>
          <div class="faq-grid">
            <details class="faq-item">
              <summary>Что такое единое пособие?</summary>
              <p>Единое пособие — это мера государственной поддержки для беременных женщин и семей с детьми от 0 до 17 лет, чей среднедушевой доход ниже регионального прожиточного минимума.</p>
            </details>
            <details class="faq-item">
              <summary>Кто имеет право на пособие?</summary>
              <p>Право на пособие имеют семьи с детьми до 17 лет и беременные женщины, вставшие на учет на ранних сроках. Основные условия: гражданство РФ и постоянное проживание в России.</p>
            </details>
            <details class="faq-item">
              <summary>Как рассчитывается размер пособия?</summary>
              <p>Размер пособия зависит от нуждаемости семьи и составляет 50%, 75% или 100% от регионального прожиточного минимума на ребенка.</p>
            </details>
            <details class="faq-item">
              <summary>Что такое «правило нулевого дохода»?</summary>
              <p>Это правило означает, что пособие назначается при условии, что у взрослых членов семьи был трудовой доход или есть объективная причина его отсутствия.</p>
            </details>
          </div>
        </div>
      </section>
    </article>
  </div>
  <Footer />
</template>

<script setup>
import { findRegionByCode } from '~/data/regions.js'
import Breadcrumbs from '~/components/Breadcrumbs.vue'

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
const title = `Калькулятор единого пособия на детей в ${regionGenitive}`
const description = `Рассчитайте размер единого пособия для семей с детьми от 0 до 17 лет в ${regionGenitive}. Учет прожиточного минимума вашего региона.`

useSeoMeta({
  title: title,
  description: description,
  ogTitle: `Единое пособие на детей в ${regionGenitive} — Калькулятор`,
  ogDescription: description,
  keywords: `единое пособие, пособие на детей, детские пособия, калькулятор пособий, ${regionGenitive}`
})

const breadcrumbs = [
  { text: 'Главная', to: '/' },
  { text: 'Единое пособие', to: '/edinoe-posobie' },
  { text: 'Калькулятор на детей', to: '/edinoe-posobie/calculator/detyam' },
  { text: currentRegion.name }
];
</script>

<style lang="scss" scoped>
// ===== MODERN COLOR PALETTE =====
$color-primary: #1a1a1a;
$color-secondary: #666666;
$color-tertiary: #999999;
$color-background: #ffffff;
$color-surface: #f8f9fa;
$color-border: #e8ecef;
$color-accent: #2563eb;
$color-accent-light: #3b82f6;

// Notice colors
$color-notice-bg: #eff6ff;
$color-notice-border: #bfdbfe;
$color-notice-text: #1e40af;
$color-notice-highlight: #dc2626;

// ===== SPACING SYSTEM =====
$space-xs: 0.5rem;   // 8px
$space-sm: 1rem;     // 16px
$space-md: 1.5rem;   // 24px
$space-lg: 2rem;     // 32px
$space-xl: 3rem;     // 48px
$space-2xl: 4rem;    // 64px

// ===== TYPOGRAPHY =====
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// ===== BORDER RADIUS =====
$radius-sm: 8px;
$radius-md: 12px;
$radius-lg: 16px;

// ===== SHADOWS =====
$shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
$shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
$shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

// ===== BASE STYLES =====
.calculator-page {
  max-width: 800px;
  margin: 0 auto;
  color: $color-primary;
  font-family: system-ui, -apple-system, sans-serif;
}

// ===== PAGE INTRO =====
.page-intro {
  text-align: center;
  padding: 0 $space-sm;
  margin-bottom: $space-xl;

  h1 {
    font-size: clamp(2rem, 5vw, 2.5rem);
    font-weight: $font-weight-bold;
    line-height: 1.2;
    margin-bottom: $space-md;
    letter-spacing: -0.025em;
  }

  .description {
    font-size: 1.125rem;
    line-height: 1.6;
    color: $color-secondary;
    max-width: 600px;
    margin: 0 auto;
    font-weight: $font-weight-normal;
  }
}

// ===== CALCULATOR BLOCK =====
.calculator-block {
  margin-bottom: $space-xl;
}

// ===== PROMINENT NOTICE =====
.instruction-note-wrapper {
  padding: 0 $space-sm;
  margin-bottom: $space-2xl;

  @media (min-width: 768px) {
    padding: 0;
  }
}

.prominent-notice {
  display: flex;
  align-items: flex-start;
  gap: $space-md;
  padding: $space-lg;
  background: $color-notice-bg;
  border: 1px solid $color-notice-border;
  border-radius: $radius-lg;
  backdrop-filter: blur(8px);

  @media (max-width: 767px) {
    flex-direction: column;
    text-align: center;
    gap: $space-sm;
    padding: $space-md;
  }

  .notice-icon {
    flex-shrink: 0;
    color: $color-notice-text;
    margin-top: 2px;
  }

  .notice-content {
    flex: 1;
    
    h3 {
      margin: 0 0 $space-xs;
      font-size: 1.125rem;
      font-weight: $font-weight-semibold;
      color: $color-notice-text;
    }
    
    p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
      color: $color-notice-text;
      font-weight: $font-weight-normal;
    }
    
    .button-highlight {
      color: $color-notice-highlight;
      font-weight: $font-weight-semibold;
      background: white;
      padding: 0.25rem 0.5rem;
      border-radius: $radius-sm;
      border: 1px solid $color-notice-border;
      white-space: nowrap;
    }
  }
}

// ===== FAQ SECTION =====
.faq-section {
  background-color: $color-surface;
  padding: $space-2xl 0;
  
  .faq-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 $space-sm;
  }

  h2 {
    text-align: center;
    font-size: clamp(1.75rem, 4vw, 2rem);
    font-weight: $font-weight-bold;
    margin-bottom: $space-xl;
    letter-spacing: -0.025em;
    color: $color-primary;
  }

  .faq-grid {
    display: flex;
    flex-direction: column;
    gap: $space-xs;
  }

  .faq-item {
    background: $color-background;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    overflow: hidden;
    transition: all 0.2s ease;

    &:hover {
      border-color: $color-accent-light;
      box-shadow: $shadow-sm;
    }

    &[open] {
      border-color: $color-accent;
      box-shadow: $shadow-md;
    }

    summary {
      font-size: 1.125rem;
      font-weight: $font-weight-semibold;
      padding: $space-md;
      cursor: pointer;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.2s;
      color: $color-primary;

      &:hover {
        background-color: rgba($color-accent, 0.02);
      }

      &::after {
        content: '';
        display: inline-block;
        width: 0.5em;
        height: 0.5em;
        border-right: 2px solid $color-tertiary;
        border-bottom: 2px solid $color-tertiary;
        transform: rotate(45deg);
        transition: transform 0.3s ease;
        margin-left: $space-sm;
      }
    }

    p {
      padding: 0 $space-md $space-md;
      line-height: 1.6;
      color: $color-secondary;
      margin: 0;
      font-weight: $font-weight-normal;
    }

    &[open] > summary {
      &::after {
        transform: rotate(225deg);
        border-color: $color-accent;
      }
    }
  }
}

// ===== RESPONSIVE DESIGN =====
@media (max-width: 640px) {
  .page-intro {
    margin-bottom: $space-lg;
    
    .description {
      font-size: 1rem;
    }
  }
  
  .faq-section {
    padding: $space-xl 0;
  }
  
  .faq-item summary {
    font-size: 1rem;
    padding: $space-md;
  }
}

// ===== SMOOTH ANIMATIONS =====
.prominent-notice {
  animation: slideUp 0.5s ease-out;
}

.faq-item {
  animation: fadeIn 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>