<template>
  <div class="blog-article-page">
    <Header />
    
    <main class="container">
      <div v-if="pending" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загружаем статью...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Статья не найдена</h2>
        <p>Возможно, она была удалена или перемещена</p>
        <NuxtLink to="/blog" class="back-button">
          <span>←</span>
          Вернуться к блогу
        </NuxtLink>
      </div>

      <template v-else-if="article">
        <Breadcrumbs :items="breadcrumbs" class="breadcrumbs" />
        
        <article class="article">
          <header class="article-header">
            <div class="article-meta">
              <NuxtLink :to="`/blog/${article.category}`" class="category-tag">
                {{ categoryTitle }}
              </NuxtLink>
              <div class="meta-info">
                <time class="date">{{ formatDate(article.date) }}</time>
                <span class="divider">•</span>
                <span class="read-time">{{ article.readTime }}</span>
              </div>
            </div>
            
            <h1 class="article-title">{{ article.title }}</h1>
            
            <div v-if="article.image" class="article-hero">
              <img 
                :src="article.image" 
                :alt="article.title"
                loading="lazy"
              />
            </div>
          </header>

          <!-- ==================== ИЗМЕНЕННЫЙ БЛОК ==================== -->
          <!-- Основной контент статьи -->
          <div class="article-content markdown-content">
            <!-- Используем <template> для цикла, чтобы не создавать лишних DOM-элементов -->
            <template v-for="(part, index) in contentParts" :key="`part-${index}`">
              <!-- Выводим очередную часть HTML-контента -->
              <div v-html="part"></div>
              
              <!-- Если это не последняя часть, значит, после нее должен идти калькулятор -->
              <div 
                v-if="showCalculators && index < contentParts.length - 1"
                :class="`calculator-position calculator-position-${index}`"
              >
                <SmartCalculator />
              </div>
            </template>
          </div>
          <!-- ======================================================== -->

          <footer class="article-footer">
            <div v-if="article.tags?.length" class="article-tags">
              <span class="tags-label">Теги:</span>
              <div class="tags-list">
                <span 
                  v-for="tag in article.tags" 
                  :key="tag"
                  class="tag"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </footer>
        </article>

        <!-- Похожие статьи -->
        <aside v-if="relatedArticles?.length" class="related-section">
          <h2 class="related-title">Вам может понравиться</h2>
          <div class="related-grid">
            <article 
              v-for="related in relatedArticles" 
              :key="related.slug"
              class="related-article"
            >
              <NuxtLink :to="`/blog/${related.category}/${related.slug}`" class="related-link">
                <div class="related-content">
                  <h3 class="related-article-title">{{ related.title }}</h3>
                  <p class="related-excerpt">{{ related.description }}</p>
                  <span class="read-more">Читать далее →</span>
                </div>
              </NuxtLink>
            </article>
          </div>
        </aside>
      </template>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { getCategoryBySlug } from '~/data/blogCategories'
import SmartCalculator from '~/components/SmartCalculator.vue'

const route = useRoute()
const categorySlug = computed(() => route.params.category as string)
const articleSlug = computed(() => route.params.slug as string)

const { formatDate } = useBlog()

console.log('Page: Loading article', categorySlug.value, articleSlug.value)

const { data: article, pending, error } = await useFetch(
  `/api/blog/${categorySlug.value}/${articleSlug.value}`,
  {
    key: `article-${categorySlug.value}-${articleSlug.value}`
  }
)

const { data: allCategoryArticles } = await useFetch(
  `/api/blog/${categorySlug.value}`,
  {
    key: `category-articles-${categorySlug.value}`
  }
)

// Определяем нужно ли показывать калькуляторы
const showCalculators = computed(() => {
  return article.value?.slug === 'kak-poluchit-edinoe-posobie'
})

// ==================== ИЗМЕНЕННЫЙ БЛОК ====================
// Разбиваем HTML на части по тегам калькулятора
const contentParts = computed(() => {
  if (!article.value?.html) return []
  // Используем регулярное выражение, чтобы разделить строку по тегам <smart-calculator />
  return article.value.html.split(/<smart-calculator\s*\/?>/g)
})
// ========================================================

const relatedArticles = computed(() => {
  if (!allCategoryArticles.value) return []
  return allCategoryArticles.value
    .filter(a => a.slug !== articleSlug.value)
    .slice(0, 3)
})

const category = computed(() => getCategoryBySlug(categorySlug.value))
const categoryTitle = computed(() => category.value?.title || '')

const breadcrumbs = computed(() => [
  { label: 'Главная', path: '/' },
  { label: 'Блог', path: '/blog' },
  { label: categoryTitle.value, path: `/blog/${categorySlug.value}` },
  { label: article.value?.title || '', path: route.path }
])

useHead({
  title: computed(() => article.value?.title || 'Статья'),
  meta: computed(() => [
    {
      name: 'description',
      content: article.value?.description || ''
    },
    {
      property: 'og:title',
      content: article.value?.title || ''
    },
    {
      property: 'og:description',
      content: article.value?.description || ''
    },
    {
      property: 'og:image',
      content: article.value?.image || ''
    },
    {
      property: 'og:type',
      content: 'article'
    }
  ])
})
</script>

<style scoped lang="scss">
.blog-article-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.container {
  max-width: 768px;
  margin: 0 auto;
  padding: 0 24px;
  flex: 1;
}

/* Состояния загрузки и ошибки */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 48px 24px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid #f1f3f4;
  border-top: 3px solid #1a73e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.error-state h2 {
  font-size: 1.5rem;
  color: #202124;
  margin-bottom: 12px;
  font-weight: 500;
}

.error-state p {
  color: #5f6368;
  margin-bottom: 32px;
  line-height: 1.5;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #1a73e8;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1557b0;
    transform: translateY(-1px);
  }
}

/* Хлебные крошки */
.breadcrumbs {
  margin: 32px 0 24px;
}

/* Основная статья */
.article {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  margin: 24px 0 48px;
}

.article-header {
  margin-bottom: 48px;
}

.article-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.category-tag {
  display: inline-block;
  padding: 6px 12px;
  background: #e8f0fe;
  color: #1a73e8;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #d2e3fc;
    transform: translateY(-1px);
  }
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5f6368;
  font-size: 0.875rem;
}

.divider {
  opacity: 0.5;
}

.article-title {
  font-size: 2.5rem;
  line-height: 1.2;
  color: #202124;
  margin-bottom: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.article-hero {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
}

.article-content {
  margin-bottom: 32px;
}

/* Футер статьи */
.article-footer {
  padding-top: 32px;
  border-top: 1px solid #e8eaed;
}

.article-tags {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tags-label {
  font-weight: 500;
  color: #5f6368;
  font-size: 0.875rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background: #f8f9fa;
  color: #5f6368;
  border-radius: 16px;
  font-size: 0.813rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e8f0fe;
    color: #1a73e8;
  }
}

/* Похожие статьи */
.related-section {
  margin: 64px 0;
}

.related-title {
  font-size: 1.5rem;
  color: #202124;
  margin-bottom: 32px;
  font-weight: 600;
  text-align: center;
}

.related-grid {
  display: grid;
  gap: 24px;
}

.related-article {
  background: white;
  border: 1px solid #e8eaed;
  border-radius: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    border-color: #1a73e8;
    box-shadow: 0 8px 24px rgba(26, 115, 232, 0.12);
    transform: translateY(-2px);
  }
}

.related-link {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 24px;
}

.related-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.related-article-title {
  font-size: 1.125rem;
  line-height: 1.4;
  color: #202124;
  margin-bottom: 12px;
  font-weight: 500;
}

.related-excerpt {
  color: #5f6368;
  line-height: 1.6;
  margin-bottom: 16px;
  flex: 1;
}

.read-more {
  color: #1a73e8;
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.related-article:hover .read-more {
  color: #1557b0;
}

/* Стили для контента Markdown */
.markdown-content {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #3c4043;

  /* Стили для калькуляторов */
  :deep(.calculator-position) {
    margin: 3rem 0;
    
    .smart-calculator {
      border: 1px solid #e8eaed;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
  }

  /* Остальные стили markdown остаются без изменений */
  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin-top: 2em;
    margin-bottom: 0.75em;
    font-weight: 600;
    line-height: 1.3;
    color: #202124;
    scroll-margin-top: 80px;
  }

  :deep(h1) {
    font-size: 2em;
    margin-top: 0;
    padding-bottom: 0.5em;
    border-bottom: 1px solid #e8eaed;
  }

  :deep(h2) {
    font-size: 1.5em;
  }

  :deep(h3) {
    font-size: 1.25em;
  }

  :deep(p) {
    margin-bottom: 1.5em;
  }

  :deep(a) {
    color: #1a73e8;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #1557b0;
      text-decoration: underline;
    }
  }

  :deep(ul), :deep(ol) {
    margin-bottom: 1.5em;
    padding-left: 1.5em;

    li {
      margin-bottom: 0.5em;
      
      &::marker {
        color: #1a73e8;
      }
    }
  }

  :deep(blockquote) {
    margin: 2em 0;
    padding: 1.5em;
    background: #f8f9fa;
    border-left: 4px solid #1a73e8;
    border-radius: 0 8px 8px 0;
    font-style: italic;

    p:last-child {
      margin-bottom: 0;
    }
  }

  :deep(code) {
    background: #f1f3f4;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 0.9em;
    color: #d32f2f;
  }

  :deep(pre) {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 1.5em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 2em 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    code {
      background: none;
      padding: 0;
      color: inherit;
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2em 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 2em 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;

    th, td {
      padding: 1em;
      border-bottom: 1px solid #e8eaed;
      text-align: left;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #202124;
    }

    tr:hover {
      background: #f8f9fa;
    }
  }

  :deep(hr) {
    margin: 3em 0;
    border: none;
    border-top: 1px solid #e8eaed;
  }

  :deep(.alert) {
    padding: 1.5em;
    border-radius: 8px;
    margin: 2em 0;
    display: flex;
    gap: 1em;
    align-items: flex-start;

    &.alert-info {
      background: #e8f4fd;
      border-left: 4px solid #1a73e8;
      color: #1557b0;
    }

    &.alert-warning {
      background: #fff8e6;
      border-left: 4px solid #ffa726;
      color: #f57c00;
    }

    &.alert-success {
      background: #e8f5e8;
      border-left: 4px solid #4caf50;
      color: #2e7d32;
    }

    &.alert-danger {
      background: #ffebee;
      border-left: 4px solid #f44336;
      color: #c62828;
    }

    .alert-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .alert-content {
      flex: 1;

      p:last-child {
        margin-bottom: 0;
      }
    }
  }

  :deep(.scheme) {
    margin: 2em 0;
    padding: 1.5em;
    background: #f8f9fa;
    border-radius: 8px;

    h4 {
      margin-top: 0;
      margin-bottom: 1em;
      color: #202124;
    }

    .scheme-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1em;

      .step {
        padding: 0.5em 1em;
        background: white;
        border-radius: 6px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .arrow {
        color: #1a73e8;
        font-weight: bold;
      }
    }

    .examples {
      display: flex;
      flex-direction: column;
      gap: 0.5em;

      .example {
        padding: 0.75em;
        background: white;
        border-radius: 6px;
        border-left: 3px solid #1a73e8;
      }
    }
  }

  :deep(.cta-section) {
    text-align: center;
    margin: 3em 0;
    padding: 2em;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;

    h3 {
      margin-top: 0;
      color: white;
    }

    .cta-button {
      display: inline-block;
      padding: 12px 24px;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    }
  }
}

/* Анимации */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Адаптивность */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .article-title {
    font-size: 2rem;
  }
  
  .article {
    margin: 16px 0 32px;
    border-radius: 12px;
  }
  
  .markdown-content {
    font-size: 1rem;
    
    :deep(.calculator-position) {
      margin: 2rem -16px;
      
      .smart-calculator {
        border-radius: 0;
        border-left: none;
        border-right: none;
      }
    }
    
    :deep(h1) {
      font-size: 1.75em;
    }
    
    :deep(h2) {
      font-size: 1.375em;
    }
    
    :deep(pre) {
      padding: 1em;
      margin: 1.5em -16px;
      border-radius: 0;
    }

    :deep(.scheme-steps) {
      flex-direction: column;
      
      .arrow {
        transform: rotate(90deg);
      }
    }
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 800px;
  }
  
  .related-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>