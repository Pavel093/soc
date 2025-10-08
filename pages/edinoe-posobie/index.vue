<template>
<Header></Header>
<Hero></Hero>
<Calculator></Calculator>
<Advantages></Advantages>
<HowItWorks></HowItWorks>
<FAQ></FAQ>
<WidgetSection></WidgetSection>
<CtaSection></CtaSection>
<Footer></Footer>

</template>

<script setup>
import Header from '../components/Header.vue'
import Hero from '../components/landing/edinoe_posobie/HeroSection.vue'
import Calculator from '../components/SmartCalculator.vue'
import Advantages from '../components/landing/edinoe_posobie/AdvantagesSection.vue'
import HowItWorks from '../components/landing/edinoe_posobie/HowItWorks.vue'
import FAQ from '../components/landing/edinoe_posobie/FAQ.vue'
import WidgetSection from '../components/landing/edinoe_posobie/WidgetSection.vue'
import CtaSection from '../components/landing/edinoe_posobie/CtaSection.vue'
import Footer from '../components/Footer.vue'

const newLocal = 'https://всепособия.рф/edinoe-posobie';

useSeoMeta({
  title: 'Калькулятор единого пособия 2025 — онлайн-расчет выплат',

  description: 'Точный онлайн-калькулятор единого пособия на 2025 год. Рассчитайте размер выплат для семей с детьми и беременных с учетом дохода, имущества и региона. Бесплатно и без регистрации.',
  
  ogTitle: 'Калькулятор единого пособия 2025: онлайн расчет для семей с детьми и беременных',
  ogDescription: 'Рассчитайте точный размер единого пособия на 2025 год с учетом всех новых правил. Учитываем доходы, имущество и регион проживания. Бесплатно!',
  ogUrl: newLocal,
  ogType: 'website',

  twitterCard: 'summary_large_image',
  twitterTitle: 'Калькулятор единого пособия 2025: онлайн расчет',
  twitterDescription: 'Рассчитайте точный размер единого пособия на 2025 год с учетом всех новых правил. Бесплатно и без регистрации.',
});


</script>

<style scoped lang="scss">

</style>