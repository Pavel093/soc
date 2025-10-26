<template>
  <nav aria-label="breadcrumb" class="breadcrumbs-wrapper" v-if="items && items.length">
    <div class="breadcrumbs-container">
      <ol class="breadcrumbs__list">
        <li
          v-for="(item, index) in items"
          :key="getItemKey(item)"
          class="breadcrumbs__item"
        >
          <NuxtLink v-if="getItemPath(item)" :to="getItemPath(item)" class="breadcrumbs__link">
            {{ getItemLabel(item) }}
          </NuxtLink>
          <span v-else class="breadcrumbs__current" aria-current="page">
            {{ getItemLabel(item) }}
          </span>
          <span v-if="index < items.length - 1" class="breadcrumbs__separator" aria-hidden="true">/</span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

// Универсальные геттеры для поддержки разных форматов
const getItemLabel = (item) => {
  return item.label || item.text || ''
}

const getItemPath = (item) => {
  return item.path || item.to || null
}

const getItemKey = (item) => {
  return getItemPath(item) || getItemLabel(item)
}
</script>

<style scoped lang="scss">
.breadcrumbs-wrapper {
  width: 100%;
  padding-top: 1.5rem; 
  padding-bottom: 1.5rem;
  @media (max-width: 768px) {
    padding: 0 ;
    margin: 0;
  }
}

.breadcrumbs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  @media (max-width: 768px) {
    padding: 1rem ;
    margin: 0;
  }
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