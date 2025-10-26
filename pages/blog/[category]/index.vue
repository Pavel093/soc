<template>
  <div class="blog-category-page">
    <Header />
    
    <main class="container">
      <div v-if="pending" class="loading">
        <p>Загрузка...</p>
      </div>

      <div v-else-if="error" class="error-message">
        <h2>Ошибка загрузки</h2>
        <p>{{ error.message }}</p>
        <NuxtLink to="/blog" class="back-link">← Вернуться к блогу</NuxtLink>
      </div>

      <template v-else>
        <Breadcrumbs :items="breadcrumbs" />
        
        <section class="category-hero">
          <div class="category-icon">{{ category?.icon }}</div>
          <h1>{{ category?.title }}</h1>
          <p>{{ category?.description }}</p>
        </section>

        <section class="articles-section">
          <div v-if="articles && articles.length > 0" class="articles-grid">
            <article 
              v-for="article in articles" 
              :key="article.slug"
              class="article-card"
            >
              <NuxtLink :to="`/blog/${categorySlug}/${article.slug}`">
                <div class="article-image" v-if="article.image">
                  <img :src="article.image" :alt="article.title" />
                </div>
                <div class="article-content">
                  <div class="article-meta">
                    <span class="date">{{ formatDate(article.date) }}</span>
                    <span class="read-time">{{ article.readTime }}</span>
                  </div>
                  <h2>{{ article.title }}</h2>
                  <p>{{ article.description }}</p>
                  
                  <div class="article-tags" v-if="article.tags && article.tags.length">
                    <span 
                      v-for="tag in article.tags" 
                      :key="tag"
                      class="tag"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </NuxtLink>
            </article>
          </div>
          
          <div v-else class="no-articles">
            <p>В этом разделе пока нет статей</p>
          </div>
        </section>
      </template>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { getCategoryBySlug } from '~/data/blogCategories'

const route = useRoute()
const categorySlug = computed(() => route.params.category as string)
const { formatDate } = useBlog()

console.log('Page: Loading category page for:', categorySlug.value)

const category = computed(() => getCategoryBySlug(categorySlug.value))

// Загружаем статьи категории напрямую через useFetch
const { data: articles, pending, error } = await useFetch(
  `/api/blog/${categorySlug.value}`,
  {
    key: `category-${categorySlug.value}`
  }
)

console.log('Page: Articles loaded:', articles.value?.length)

const breadcrumbs = computed(() => [
  { label: 'Главная', path: '/' },
  { label: 'Блог', path: '/blog' },
  { label: category.value?.title || '', path: `/blog/${categorySlug.value}` }
])

useHead({
  title: computed(() => `${category.value?.title} - Блог ВсеПособия.рф`),
  meta: computed(() => [
    {
      name: 'description',
      content: category.value?.description || ''
    }
  ])
})
</script>

<style scoped lang="scss">
.blog-category-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  flex: 1;
}

.loading {
  text-align: center;
  padding: 100px 20px;
  color: #666;
  font-size: 1.125rem;
}

.error-message {
  text-align: center;
  padding: 100px 20px;
  
  h2 {
    font-size: 2rem;
    color: #d32f2f;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
  
  .back-link {
    display: inline-block;
    padding: 12px 24px;
    background: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 6px;
  }
}

.category-hero {
  text-align: center;
  padding: 60px 0;
  
  .category-icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
  }
  
  p {
    font-size: 1.25rem;
    color: #666;
  }
}

.articles-section {
  margin-bottom: 80px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  
  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
}

.article-image {
  height: 220px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.article-content {
  padding: 25px;
}

.article-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: #999;
  
  .read-time::before {
    content: '•';
    margin-right: 10px;
  }
}

.article-card h2 {
  font-size: 1.375rem;
  margin-bottom: 12px;
  color: #2c3e50;
  line-height: 1.4;
}

.article-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .tag {
    background: #f0f0f0;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.813rem;
    color: #666;
  }
}

.no-articles {
  text-align: center;
  padding: 60px 0;
  color: #999;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .category-hero h1 {
    font-size: 2rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>