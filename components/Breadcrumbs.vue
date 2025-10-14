<template>
  <nav aria-label="breadcrumb" class="breadcrumbs-wrapper" v-if="items && items.length">
    <div class="breadcrumbs-container">
      <ol class="breadcrumbs__list">
        <li
          v-for="(item, index) in items"
          :key="item.to || item.text"
          class="breadcrumbs__item"
        >
          <NuxtLink v-if="item.to" :to="item.to" class="breadcrumbs__link">
            {{ item.text }}
          </NuxtLink>
          <span v-else class="breadcrumbs__current" aria-current="page">
            {{ item.text }}
          </span>
          <span v-if="index < items.length - 1" class="breadcrumbs__separator" aria-hidden="true">/</span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<style scoped lang="scss">
.breadcrumbs-wrapper {
  width: 100%;
  // Можно добавить верхний/нижний отступ, если нужно отделить от Header
  padding-top: 1.5rem; 
  padding-bottom: 1.5rem;
}

.breadcrumbs-container {
  // Эти стили повторяют стили ваших основных контейнеров (`.page-container`)
  // Теперь они встроены прямо в компонент.
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem; // Боковые отступы, чтобы не прилипать к краям
}

.breadcrumbs__list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
  font-size: 0.9rem;
}

.breadcrumbs__item {
  display: flex;
  align-items: center;
}

.breadcrumbs__link {
  color: #0d6efd;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    text-decoration: underline;
    color: #0a58ca;
  }
}

.breadcrumbs__current {
  color: #6c757d;
}

.breadcrumbs__separator {
  margin: 0 0.5rem;
  color: #adb5bd;
}
</style>