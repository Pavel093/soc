<template>
  <section v-if="links && links.length > 0" class="related-pages-section">
    <div class="container">
      <h2 class="related-pages-section__title">{{ title }}</h2>
      <ul class="related-pages-section__list">
        <li v-for="link in links" :key="link.to" class="related-pages-section__item">
          <NuxtLink :to="link.to" class="related-pages-section__link">{{ link.text }}</NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  links: {
    type: Array,
    required: true,
    validator: (links) => links.every(link => 'to' in link && 'text' in link)
  }
})
</script>

<style scoped lang="scss">
.related-pages-section {
  padding: 60px 0;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.related-pages-section__title {
  text-align: center;
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  margin-bottom: 40px;
  color: #212529;
  font-weight: 700;
}

.related-pages-section__list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: center;
}

.related-pages-section__link {
  display: block;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  color: #0d6efd;
  background-color: #e7f1ff;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  text-align: center;

  &:hover {
    background-color: #cce0ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(13, 110, 253, 0.1);
  }
}
</style>