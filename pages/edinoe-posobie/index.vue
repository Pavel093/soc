<template>
  <Header></Header>
  <div class="page-container">
    <!-- ДОБАВЛЯЕМ ХЛЕБНЫЕ КРОШКИ -->
    
    <Hero></Hero>
    <Breadcrumbs :items="breadcrumbs" />
    <Calculator></Calculator>
    <LandingEdinoePosobieShareSection></LandingEdinoePosobieShareSection>
    <LandingEdinoePosobieShareSection v-if="false"></LandingEdinoePosobieShareSection>
    <Advantages></Advantages>
    <HowItWorks></HowItWorks>
    <FAQ></FAQ>
    
    <!-- НАЧАЛО: БЛОК ПЕРЕЛИНКОВКИ -->
    <RelatedPagesSection
      title="Полезные калькуляторы и частные случаи"
      :links="relatedLinks"
    />
    <!-- КОНЕЦ: БЛОК ПЕРЕЛИНКОВКИ -->
    
    <WidgetSection></WidgetSection>
    <CtaSection></CtaSection>
  </div>
  <Footer></Footer>
</template>

<script setup>
import { computed } from 'vue';

// Импорт всех компонентов
import Header from '~/components/Header.vue';
import Hero from '~/components/landing/edinoe_posobie/HeroSection.vue';
import Calculator from '~/components/SmartCalculator.vue';
import Advantages from '~/components/landing/edinoe_posobie/AdvantagesSection.vue';
import HowItWorks from '~/components/landing/edinoe_posobie/HowItWorks.vue';
import FAQ from '~/components/landing/edinoe_posobie/FAQ.vue';
import WidgetSection from '~/components/landing/edinoe_posobie/WidgetSection.vue';
import CtaSection from '~/components/landing/edinoe_posobie/CtaSection.vue';
import Footer from '~/components/Footer.vue';
// import LandingEdinoePosobieShareSection from '~/components/landing/edinoe_posobie/ShareSection.vue' // Если есть, раскомментируйте

// Импорт компонентов для перелинковки
import RelatedPagesSection from '~/components/landing/edinoe_posobie/RelatedPagesSection.vue';
import Breadcrumbs from '~/components/Breadcrumbs.vue'; // <-- ДОБАВЛЕНО

// Импорт данных
import { calculatorPages } from '~/data/calculatorPages.js';
import { LandingEdinoePosobieShareSection } from '#components';

const newLocal = 'https://всепособия.рф/edinoe-posobie';

useSeoMeta({
  title: 'Калькулятор единого пособия 2025/2026 — онлайн-расчет выплат',
  description: 'Точный онлайн-калькулятор единого пособия на 2025/2026 год. Рассчитайте размер выплат для семей с детьми и беременных с учетом дохода, имущества и региона. Бесплатно и без регистрации.',
  ogTitle: 'Калькулятор единого пособия 2025/2026: онлайн расчет для семей с детьми и беременных',
  ogDescription: 'Рассчитайте точный размер единого пособия на 2025/2026 год с учетом всех новых правил. Учитываем доходы, имущество и регион проживания. Бесплатно!',
  ogUrl: newLocal,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Калькулятор единого пособия 2025/2026: онлайн расчет',
  twitterDescription: 'Рассчитайте точный размер единого пособия на 2025/2026 год с учетом всех новых правил. Бесплатно и без регистрации.',
});

// <-- ДОБАВЛЕНО: Данные для хлебных крошек
const breadcrumbs = computed(() => [
  { text: 'Главная', to: '/' },
  { text: 'Единое пособие' } // Текущая страница без ссылки
]);

// Логика для блока "Смотрите также"
const mainCategoryLinks = [
  { to: '/edinoe-posobie/calculator/beremennym', text: 'Для беременных' },
  { to: '/edinoe-posobie/calculator/detyam', text: 'На детей до 17 лет' }
];

const prioritySlugs = [
  'samozanyatym', 'nulevoj-dohod', 'mnogodetnye', 's-odnim-rebenkom',
  's-dvumya-detyami', 'alimenty', 'proverka-imushchestva', 'dve-kvartiry',
  'ip-predprinimateli', 'edinstvennyi-roditel'
];

const thematicLinks = prioritySlugs
  .filter(slug => calculatorPages[slug])
  .map(slug => {
    const page = calculatorPages[slug];
    return {
      to: `/edinoe-posobie/calculator/${slug}`,
      text: page.h1
    };
  });

const relatedLinks = computed(() => [...mainCategoryLinks, ...thematicLinks]);
</script>

<style scoped lang="scss">

</style>