<script setup>
import Header from '~/components/Header.vue';
import HeroSection from '~/components/landing/home/HeroSection.vue';
</script>

<template>
  <div> 
    <Header />
    <HeroSection />
    <LazyAllCards />
    <LazyAdvantagesSection />
    <LazyFooter />
  </div>
</template>

<style lang="scss">
</style>