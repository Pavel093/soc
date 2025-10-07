<script setup>
import Header from '~/components/Header.vue';
import HeroSection from '~/components/landing/home/HeroSection.vue';
import AllCards from '~/components/landing/home/AllCards.vue'
import AdvantagesSection from '~/components/landing/home/AdvantagesSection.vue'
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