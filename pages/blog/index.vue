<template>
  <div class="blog-categories-page">
    <Header />
    
    <main class="container">
      <Breadcrumbs :items="breadcrumbs" />
      
      <section class="hero-section">
        <div class="hero-content">
          <h1>Блог о социальных выплатах</h1>
          <p class="lead">
            Актуальные статьи и инструкции по получению социальной поддержки
          </p>
        </div>
        <div class="hero-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
        </div>
      </section>

      <section v-if="categories" class="categories-section">
        <div class="section-header">
          <h2>Категории статей</h2>
          <div class="section-divider"></div>
        </div>
        <div class="categories-grid">
          <article 
            v-for="category in categories" 
            :key="category.slug"
            class="category-card"
          >
            <NuxtLink :to="`/blog/${category.slug}`" class="category-link">
              <div class="category-image-wrapper">
                <div class="category-image-container">
                  <img 
                    v-if="category.slug === 'edinoe-posobie'"
                    src="~/assets/edinoe-posobie/blog-illustration/edinoe-posobie.webp" 
                    :alt="category.title"
                    class="category-image"
                  />
                  <div 
                    v-else-if="category.image"
                    class="category-image-container"
                  >
                    <img 
                      :src="category.image" 
                      :alt="category.title"
                      class="category-image"
                    />
                  </div>
                  <div v-else class="category-icon-fallback">
                    <span class="fallback-emoji">{{ category.icon }}</span>
                  </div>
                  <div class="image-gradient-overlay"></div>
                </div>
                <div class="category-icon">
                  <span v-if="category.icon" class="icon-emoji">{{ category.icon }}</span>
                  <div v-else class="icon-fallback">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="category-content">
                <h3>{{ category.title }}</h3>
                <p>{{ category.description }}</p>
                <div class="category-footer">
                  <span class="articles-count">
                    {{ category.articlesCount }} {{ getArticlesWord(category.articlesCount) }}
                  </span>
                  <div class="arrow-container">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>

      <section v-if="recentArticles" class="recent-articles-section">
        <div class="section-header">
          <h2>Последние статьи</h2>
          <div class="section-divider"></div>
        </div>
        <div class="articles-grid">
          <article 
            v-for="article in recentArticles" 
            :key="`${article.category}-${article.slug}`"
            class="article-card"
          >
            <NuxtLink :to="`/blog/${article.category}/${article.slug}`" class="article-link">
              <div class="article-image-wrapper">
                <div class="article-image-container" v-if="article.image">
                  <img 
                    :src="article.image" 
                    :alt="article.title"
                    class="article-image"
                  />
                  <div class="image-gradient-overlay"></div>
                </div>
                <div v-else class="article-image-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <div class="article-badge">
                  <span>{{ getCategoryTitle(article.category) }}</span>
                </div>
              </div>
              <div class="article-content">
                <div class="article-meta">
                  <span class="date">{{ formatDate(article.date) }}</span>
                </div>
                <h3>{{ article.title }}</h3>
                <p class="article-excerpt">{{ article.description }}</p>
                <div class="article-read-more">
                  <span>Читать</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { getCategoryBySlug } from '~/data/blogCategories'

const { formatDate } = useBlog()

const breadcrumbs = [
  { label: 'Главная', path: '/' },
  { label: 'Блог', path: '/blog' }
]

// Загружаем данные напрямую
const { data: categories } = await useFetch('/api/blog/categories')
const { data: recentArticles } = await useFetch('/api/blog/recent?limit=6')

const getCategoryTitle = (categorySlug: string) => {
  return getCategoryBySlug(categorySlug)?.title || categorySlug
}

// Функция для правильного склонения слова "статья"
const getArticlesWord = (count: number) => {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'статей'
  }
  
  if (lastDigit === 1) {
    return 'статья'
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'статьи'
  }
  
  return 'статей'
}

useHead({
  title: 'Блог о социальных пособиях и выплатах',
  meta: [
    {
      name: 'description',
      content: 'Полезные статьи и инструкции о получении социальных пособий, декретных выплат, семейной ипотеки и других мерах поддержки'
    }
  ]
})
</script>

<style scoped lang="scss">
/* Стили остаются без изменений */
.blog-categories-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  flex: 1;
}

.hero-section {
  position: relative;
  padding: 80px 0 60px;
  text-align: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  border-radius: 0 0 24px 24px;
  margin: 0 -24px 60px;
  overflow: hidden;
  
  .hero-content {
    position: relative;
    z-index: 2;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: white;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  
  .lead {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
    font-weight: 400;
  }
}

.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
  }
  
  .circle-1 {
    width: 120px;
    height: 120px;
    top: 20%;
    left: 10%;
  }
  
  .circle-2 {
    width: 80px;
    height: 80px;
    bottom: 30%;
    right: 15%;
  }
}

.section-header {
  margin-bottom: 48px;
  text-align: center;
  
  h2 {
    font-size: 2rem;
    color: #1e293b;
    font-weight: 600;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
  }
}

.section-divider {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 2px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  gap: 24px;
  margin-bottom: 80px;
}

.category-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
    border-color: #2563eb;
    
    .category-image {
      transform: scale(1.05);
    }
    
    .category-icon {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      transform: scale(1.1);
    }
    
    .arrow-container {
      transform: translateX(3px);
    }
  }
}

.category-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.category-image-wrapper {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.category-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 58, 138, 0.4) 0%,
    rgba(37, 99, 235, 0.2) 50%,
    transparent 100%
  );
  mix-blend-mode: multiply;
}

.category-icon-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  
  .fallback-emoji {
    font-size: 2.5rem;
    filter: brightness(0) invert(1);
  }
}

.category-icon {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  .icon-emoji {
    font-size: 1.25rem;
  }
  
  .icon-fallback {
    color: #2563eb;
  }
}

.category-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 8px;
    color: #1e293b;
    font-weight: 600;
    line-height: 1.4;
  }
  
  p {
    color: #64748b;
    margin-bottom: 16px;
    line-height: 1.5;
    font-size: 0.9375rem;
    flex: 1;
  }
}

.category-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .articles-count {
    color: #475569;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .arrow-container {
    color: #2563eb;
    transition: transform 0.2s ease;
  }
}

.recent-articles-section {
  margin-bottom: 80px;
}

.articles-grid {
  display: grid;
  gap: 24px;
}

.article-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(30, 58, 138, 0.12);
    border-color: #2563eb;
    
    .article-image {
      transform: scale(1.05);
    }
    
    .article-read-more {
      color: #1e3a8a;
      
      svg {
        transform: translateX(3px);
      }
    }
  }
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.article-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.article-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.article-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  
  svg {
    color: white;
  }
}

.article-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  
  span {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    color: #1e40af;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.article-content {
  padding: 24px;
  
  .article-meta {
    margin-bottom: 12px;
    
    .date {
      color: #64748b;
      font-size: 0.875rem;
    }
  }
  
  h3 {
    font-size: 1.125rem;
    margin-bottom: 12px;
    color: #1e293b;
    font-weight: 600;
    line-height: 1.4;
  }
  
  .article-excerpt {
    color: #64748b;
    line-height: 1.5;
    font-size: 0.9375rem;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.article-read-more {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
  
  svg {
    transition: transform 0.2s ease;
  }
}

/* Десктопная версия */
@media (min-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }
  
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }
}

/* Большие десктопы */
@media (min-width: 1280px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Планшеты */
@media (max-width: 1023px) and (min-width: 769px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Мобильная версия */
@media (max-width: 768px) {
  .container {
    padding: 0 20px;
  }
  
  .hero-section {
    padding: 60px 0 40px;
    margin: 0 -20px 40px;
    border-radius: 0 0 20px 20px;
    
    h1 {
      font-size: 2rem;
    }
    
    .lead {
      font-size: 1.125rem;
    }
  }
  
  .section-header {
    margin-bottom: 32px;
    
    h2 {
      font-size: 1.75rem;
    }
  }
  
  .categories-grid,
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .category-image-wrapper {
    height: 170px !important;
  }
  
  .category-content {
    padding: 20px;
  }
  
  .article-image-wrapper {
    height: 140px !important;
  }
  
  .article-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: 1.75rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
  }
  
  .category-content h3 {
    font-size: 1.125rem;
  }
  
  .article-content h3 {
    font-size: 1rem;
  }
  
  .category-image-wrapper {
    height: 120px;
  }
  
  .article-image-wrapper {
    height: 140px;
  }
}
</style>