<template>
  <div class="minimal-layout">
    <Header />
    <article class="page-container">
      <!-- Хлебные крошки -->
      <Breadcrumbs :items="breadcrumbs" />

      <header class="page-intro">
        <h1>Калькулятор единого пособия для беременных 2025</h1>
        <p class="description">
          Рассчитайте точный размер выплаты онлайн за 2 минуты. Калькулятор автоматически определит ваш регион и подставит актуальный прожиточный минимум для максимально точного расчета.
        </p>
      </header>

      <!-- Калькулятор без отступов -->
      <section class="calculator-fullwidth">
        <SmartCalculator />
      </section>

      <section class="features-section">
        <h2>Почему наш калькулятор — это удобно?</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="icon">✅</div>
            <h3>Актуально на 2025 год</h3>
            <p>Учитываем все последние изменения законодательства и актуальные прожиточные минимумы по регионам.</p>
          </div>
          <div class="feature-item">
            <div class="icon">🔒</div>
            <h3>Анонимно и бесплатно</h3>
            <p>Не нужно вводить телефон, почту или личные данные. Все расчеты конфиденциальны.</p>
          </div>
          <div class="feature-item">
            <div class="icon">🎯</div>
            <h3>Точный результат</h3>
            <p>Задаем правильные вопросы о доходах, имуществе и составе семьи, чтобы вы получили достоверный ответ.</p>
          </div>
        </div>
      </section>

      <!-- Блок ссылок на регионы -->
      <RelatedPagesSection
        title="Рассчитать пособие для беременных в вашем регионе"
        :links="regionLinks"
      />

      <section class="faq-section">
        <h2>Частые вопросы о пособии для беременных</h2>
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
          <details>
            <summary>{{ faq.question }}</summary>
            <p>{{ faq.answer }}</p>
          </details>
        </div>
      </section>
    </article>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Импорты компонентов
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
import SmartCalculator from '~/components/SmartCalculator.vue';
import RelatedPagesSection from '~/components/landing/edinoe_posobie/RelatedPagesSection.vue';
import Breadcrumbs from '~/components/Breadcrumbs.vue';

// Импорт данных
import { getRegionsSortedByName } from '~/data/regions.js';

useSeoMeta({
  title: 'Калькулятор единого пособия для беременных 2025 — Рассчитать онлайн',
  description: 'Рассчитайте онлайн размер единого пособия для беременных женщин. Калькулятор автоматически определит ваш регион и учтет актуальный прожиточный минимум на 2025 год.',
  keywords: 'единое пособие, пособие беременным, калькулятор пособий, онлайн расчет, 2025, прожиточный минимум'
});

const faqs = [
  { question: 'На каком сроке можно подать заявление?', answer: 'Заявление на единое пособие можно подать после наступления 12 недель беременности. Однако выплата будет назначена за период начиная с 6 недель беременности, но не ранее постановки на учет в медицинской организации.' },
  { question: 'Какой доход семьи учитывается при назначении пособия?', answer: 'Учитываются доходы всех членов семьи за 12 календарных месяцев, предшествующих 1 месяцу перед месяцем подачи заявления. Например, если вы подаете заявление в июле 2025 года, будут учитываться доходы с июня 2024 по май 2025 года.' },
  { question: 'Какую сумму я буду получать?', answer: 'Размер пособия зависит от нуждаемости семьи и может составлять 50%, 75% или 100% от прожиточного минимума для трудоспособного населения, установленного в вашем регионе.' }
];

// Данные для хлебных крошек
const breadcrumbs = computed(() => [
  { text: 'Главная', to: '/' },
  { text: 'Единое пособие', to: '/edinoe-posobie' },
  { text: 'Калькулятор для беременных' }
]);

// Формируем список ссылок на регионы
const regionLinks = computed(() => getRegionsSortedByName().map(region => ({
  to: `/edinoe-posobie/calculator/beremennym/${region.code}`,
  text: region.name
})));
</script>

<style scoped lang="scss">
.minimal-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-container {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
}

// Секция калькулятора без отступов
.calculator-fullwidth {
  margin: 0 -20px;
  
  @media (max-width: 768px) {
    margin: 0 -16px;
  }
}

.page-intro {
  text-align: center;
  margin: 40px 0 60px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  .description {
    font-size: 1.125rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
}

.features-section {
  margin: 80px 0;
  
  h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 48px;
    font-weight: 600;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.feature-item {
  text-align: center;
  padding: 32px 24px;
  border-radius: 12px;
  background: #f8f9fa;
  
  .icon {
    font-size: 2rem;
    margin-bottom: 16px;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
}

.faq-section {
  margin: 80px 0;
  
  h2 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 48px;
    font-weight: 600;
  }
}

.faq-item {
  margin-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
  
  details {
    padding: 20px 0;
    
    summary {
      font-weight: 600;
      cursor: pointer;
      font-size: 1.125rem;
      padding: 8px 0;
      
      &:hover {
        color: #007bff;
      }
    }
    
    p {
      padding: 16px 0 8px;
      color: #666;
      line-height: 1.6;
    }
  }
}

// Адаптивность для мобильных устройств
@media (max-width: 768px) {
  .page-intro {
    margin: 24px 0 40px;
  }
  
  .features-section,
  .faq-section {
    margin: 60px 0;
  }
  
  .feature-item {
    padding: 24px 16px;
  }
}
</style>