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

      <!-- ЗАМЕТНОЕ УВЕДОМЛЕНИЕ О КНОПКЕ "ДАЛЕЕ" -->
      <div class="instruction-note prominent-notice">
        <div class="notice-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <div class="notice-content">
          <h3>Внимание: важно!</h3>
          <p>После ответа на вопрос <strong>обязательно нажмите кнопку <span class="button-highlight">«Далее»</span></strong>, чтобы перейти к следующему шагу расчета.</p>
        </div>
        <div class="notice-arrow">
          <svg style="rotate: -90deg;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </div>
      </div>

      <!-- БЛОК: Часто задаваемые вопросы (FAQ) -->
      <section class="faq-section">
        <h2>Часто задаваемые вопросы</h2>
        <details class="faq-item">
          <summary>Что такое единое пособие?</summary>
          <p>Единое пособие — это мера государственной поддержки для беременных женщин и семей с детьми от 0 до 17 лет, чей среднедушевой доход ниже регионального прожиточного минимума. Оно объединило в себе несколько ранее действовавших выплат.</p>
        </details>
        <details class="faq-item">
          <summary>Кто имеет право на пособие?</summary>
          <p>Право на пособие имеют семьи с детьми до 17 лет и беременные женщины, вставшие на учет на ранних сроках. Основные условия: гражданство РФ и постоянное проживание в России, среднедушевой доход семьи ниже прожиточного минимума на душу населения в регионе, а также соответствие имущества семьи установленным критериям.</p>
        </details>
        <details class="faq-item">
          <summary>Как рассчитывается размер пособия?</summary>
          <p>Размер пособия зависит от нуждаемости семьи и составляет 50%, 75% или 100% от регионального прожиточного минимума на ребенка. Базовый размер — 50%. Если даже с этой выплатой доход семьи не достигает прожиточного минимума, назначается 75%. Если и этого недостаточно — назначается 100%.</p>
        </details>
        <details class="faq-item">
          <summary>Что такое «правило нулевого дохода»?</summary>
          <p>Это правило означает, что пособие назначается при условии, что у взрослых членов семьи был трудовой доход (зарплата, пенсия, доход от бизнеса и т.д.) или есть объективная причина его отсутствия. К уважительным причинам относятся, например, уход за ребенком до 3 лет, уход за инвалидом, очное обучение, срочная служба в армии и другие.</p>
        </details>
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
const title = `Калькулятор единого пособия на детей в ${regionGenitive} в 2025 году`
const description = `Рассчитайте онлайн размер единого пособия для семей с детьми от 0 до 17 лет в ${regionGenitive}. Калькулятор учтет прожиточный минимум, установленный в вашем регионе, для точного и актуального расчета.`

useSeoMeta({
  title: title,
  description: description,
  ogTitle: `Единое пособие на детей в ${regionGenitive} — Калькулятор 2025`,
  ogDescription: description,
  keywords: `единое пособие, пособие на детей, детские пособия, калькулятор пособий, ${regionGenitive}, 2025, прожиточный минимум`
})

const breadcrumbs = [
  { text: 'Главная', to: '/' },
  { text: 'Единое пособие', to: '/edinoe-posobie' },
  { text: 'Калькулятор на детей', to: '/edinoe-posobie/calculator/detyam' },
  { text: currentRegion.name }
];
</script>

<style lang="scss" scoped>
// Стили полностью скопированы из компонента для беременных для консистентности
$color-text-primary: #2c3e50;
$color-text-secondary: #5a6b7e;
$color-background-light: #f8f9fa;
$color-border: #e9ecef;
$color-accent-bg: #eef2ff;
$color-accent-border: #c7d2fe;
$color-accent-text: #4338ca;

// Новые цвета для заметного уведомления
$color-notice-bg: #fff8e6;
$color-notice-border: #ffd54f;
$color-notice-text: #e65100;
$color-notice-highlight: #d84315;

// Типографика
$font-size-base: 1rem;

// Отступы
$spacing-base: 1rem;
$spacing-medium: 1.5rem;
$spacing-large: 2.5rem;

// Мобильные отступы
$spacing-base-mobile: 1rem;
$spacing-medium-mobile: 1rem;
$spacing-large-mobile: 1rem;

// Границы и скругления
$border-radius: 12px;
$border-base: 1px solid $color-border;

.calculator-page {
  color: $color-text-primary;
  max-width: 800px;
  margin: 0 auto;
  // УБРАЛ общий отступ для мобильной версии
}

.page-intro {
  text-align: center;
  margin-bottom: $spacing-large;

  // Мобильные отступы - ДОБАВИЛ боковые отступы только для заголовка
  @media (max-width: 767px) {
    margin-bottom: $spacing-large-mobile;
    padding: 0 $spacing-base-mobile; // Отступы только для заголовка
    
    h1 {
      font-size: clamp(1.5rem, 5vw, 2.25rem);
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }

    .description {
      font-size: 1rem;
      line-height: 1.5;
    }
  }

  h1 {
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

// Калькулятор - без дополнительных отступов для мобильной версии
.calculator-block {
  margin-bottom: $spacing-medium;
  // УБЕДИЛСЯ что нет отступов для мобильной версии
}

// ЗАМЕТНЫЕ СТИЛИ ДЛЯ УВЕДОМЛЕНИЯ О КНОПКЕ "ДАЛЕЕ"
.instruction-note.prominent-notice {
  display: flex;
  align-items: center;
  gap: $spacing-base;
  padding: $spacing-medium;
  margin-bottom: $spacing-large;
  background: linear-gradient(135deg, $color-notice-bg 0%, lighten($color-notice-bg, 2%) 100%);
  border: 2px solid $color-notice-border;
  border-radius: $border-radius;
  color: $color-notice-text;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  // Анимация пульсации
  animation: pulse-gentle 2s ease-in-out infinite;

  // Мобильные стили - ДОБАВИЛ боковые отступы только для уведомления
  @media (max-width: 767px) {
    padding: $spacing-medium-mobile;
    margin-bottom: $spacing-large-mobile;
    gap: $spacing-base-mobile;
    flex-direction: column;
    text-align: center;
    margin-left: $spacing-base-mobile; // Отступы только для уведомления
    margin-right: $spacing-base-mobile; // Отступы только для уведомления
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, $color-notice-highlight, $color-notice-border);
  }

  .notice-icon {
    flex-shrink: 0;
    color: $color-notice-highlight;
    animation: bounce 2s ease-in-out infinite;

    // Мобильные стили
    @media (max-width: 767px) {
      width: 24px;
      height: 24px;
    }
  }

  .notice-content {
    flex: 1;
    
    // Мобильные стили
    @media (max-width: 767px) {
      width: 100%;
    }
    
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: $color-notice-highlight;

      // Мобильные стили
      @media (max-width: 767px) {
        font-size: 1.1rem;
        margin-bottom: 0.25rem;
      }
    }

    p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
      font-weight: 500;

      // Мобильные стили
      @media (max-width: 767px) {
        font-size: 0.95rem;
        line-height: 1.4;
      }
    }

    .button-highlight {
      color: $color-notice-highlight;
      font-weight: 800;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.5);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      border: 1px solid $color-notice-border;

      // Мобильные стили
      @media (max-width: 767px) {
        padding: 0.15rem 0.4rem;
        font-size: 0.9rem;
      }
    }
  }

  .notice-arrow {
    flex-shrink: 0;
    color: $color-notice-highlight;
    opacity: 0.8;
    animation: slide-right 1.5s ease-in-out infinite;

    // Мобильные стили
    @media (max-width: 767px) {
      width: 20px;
      height: 20px;
    }
  }
}

// Анимации
@keyframes pulse-gentle {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 6px 20px rgba(230, 81, 0, 0.15);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes slide-right {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}

// Адаптивность для десктопов
@mixin media-up($breakpoint) {
  @media (min-width: $breakpoint) {
    @content;
  }
}

@include media-up(768px) {
  .instruction-note.prominent-notice {
    padding: $spacing-medium $spacing-large;
    flex-direction: row;
    text-align: left;
    margin-left: 0; // Сбрасываем отступы для десктопа
    margin-right: 0; // Сбрасываем отступы для десктопа
  }
}

// СТИЛИ ДЛЯ БЛОКА FAQ
.faq-section {
  margin-top: $spacing-large;
  border-top: $border-base;
  padding-top: $spacing-large;

  // Мобильные стили - ДОБАВИЛ боковые отступы только для FAQ
  @media (max-width: 767px) {
    margin-top: $spacing-large-mobile;
    padding-top: $spacing-large-mobile;
    padding-left: $spacing-base-mobile; // Отступы только для FAQ
    padding-right: $spacing-base-mobile; // Отступы только для FAQ
  }

  h2 {
    text-align: center;
    font-size: 1.75rem;
    margin-top: 0;
    margin-bottom: $spacing-large;

    // Мобильные стили
    @media (max-width: 767px) {
      font-size: 1.5rem;
      margin-bottom: $spacing-large-mobile;
    }
  }

  .faq-item {
    border-bottom: $border-base;

    &:last-child {
      border-bottom: none;
    }

    summary {
      font-size: 1.1rem;
      font-weight: 600;
      padding: $spacing-medium 0;
      cursor: pointer;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;

      // Мобильные стили
      @media (max-width: 767px) {
        font-size: 1rem;
        padding: $spacing-medium-mobile 0;
      }

      &::after {
        content: '+';
        font-size: 1.5rem;
        font-weight: 300;
        color: $color-accent-text;
        transition: transform 0.2s ease-in-out;

        // Мобильные стили
        @media (max-width: 767px) {
          font-size: 1.3rem;
        }
      }
    }

    p {
      padding-bottom: $spacing-medium;
      line-height: 1.7;
      color: $color-text-secondary;

      // Мобильные стили
      @media (max-width: 767px) {
        padding-bottom: $spacing-medium-mobile;
        font-size: 0.95rem;
        line-height: 1.6;
      }
    }
  }

  .faq-item[open] > summary::after {
    content: '−';
    transform: rotate(180deg);
  }
}
</style>