<script setup>
import Header from '~/components/Header.vue';
import HeroSection from '~/components/landing/home/HeroSection.vue';
import AllCards from '~/components/landing/home/AllCards.vue'
import AdvantagesSection from '~/components/landing/home/AdvantagesSection.vue'

useHead({
  title: 'Все калькуляторы пособий и выплат',
  meta: [
    {
      name: 'description',
      content: 'Бесплатные калькуляторы для расчета всех видов пособий, выплат и льгот. Единое пособие, декретные, алименты, материнский капитал и другие.'
    }
  ]
})
</script>

<template>
  <div> 
    <Header />
    <HeroSection />
    <LazyLandingHomeAllCards />
    <LazyLandingHomeAdvantagesSection />
    <LazyFooter />
  </div>
</template>

<style lang="scss">
</style>