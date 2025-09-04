<template>
  <div class="calculator-page">
    <!-- SEO-блок в начале -->
    <div class="seo-header">
      <h1>{{ pageData.h1 }}</h1>
      <p class="lead-text">{{ pageData.description }}</p>
      
      <!-- Вводный текст -->
      <div class="intro-section" v-if="pageData.content?.intro">
        <p>{{ pageData.content.intro }}</p>
      </div>
      
      <!-- Подсказка по использованию -->
      <div v-if="pageData.content?.hint" class="hint-box">
        <p>{{ pageData.content.hint }}</p>
      </div>
    </div>

    <!-- Универсальный калькулятор -->
    <SmartCalculator />

    <!-- SEO-контент после калькулятора -->
    <div class="seo-content">
      <!-- Секции с информацией -->
      <div 
        v-for="section in pageData.content?.sections" 
        :key="section.title"
        class="info-section"
      >
        <h2>{{ section.title }}</h2>
        <ul v-if="section.items">
          <li v-for="item in section.items" :key="item">
            {{ item }}
          </li>
        </ul>
        <div v-if="section.text" v-html="section.text"></div>
      </div>

      <!-- Блок с ссылками на похожие страницы -->
      <div class="related-pages">
        <h3>Смотрите также:</h3>
        <div class="related-links">
          <NuxtLink 
            v-for="related in relatedPages" 
            :key="related.slug"
            :to="`/edinoe-posobie/calculator/${related.slug}`"
            class="related-link"
          >
            {{ related.title }}
          </NuxtLink>
        </div>
      </div>

      <!-- FAQ секция для лучшего SEO -->
      <div class="faq-section">
        <h2>Часто задаваемые вопросы</h2>
        
        <div class="faq-item">
          <h3>Как рассчитывается единое пособие?</h3>
          <p>Единое пособие рассчитывается исходя из прожиточного минимума в вашем регионе. Размер может составлять 50%, 75% или 100% от ПМ в зависимости от доходов семьи.</p>
        </div>

        <div class="faq-item">
          <h3>Кто имеет право на единое пособие?</h3>
          <p>Право имеют беременные женщины, вставшие на учет до 12 недель, и родители детей до 17 лет при соблюдении условий по доходам и имуществу.</p>
        </div>

        <div class="faq-item">
          <h3>Какой расчетный период используется?</h3>
          <p>Учитываются доходы за 12 месяцев, которые предшествуют месяцу до месяца обращения. Например, при подаче в январе 2025 учитывается период с декабря 2023 по ноябрь 2024.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getPageData, getAllSlugs } from '~/data/calculatorPages'

const route = useRoute()
const slug = route.params.slug

// Получаем данные страницы
const pageData = getPageData(slug)

// Если страница не найдена - 404
if (!pageData) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Страница не найдена'
  })
}

// Генерируем список похожих страниц
const relatedPages = computed(() => {
  const allSlugs = getAllSlugs()
  const related = []
  
  // Логика подбора похожих страниц
  if (slug.includes('beremen')) {
    related.push({ slug: 'nulevoj-dohod', title: 'Правило нулевого дохода' })
    related.push({ slug: 'beremennym-s-detmi', title: 'Беременным с детьми' })
  }
  
  if (slug.includes('detmi') || slug.includes('rebenk')) {
    related.push({ slug: 'mnogodetnye', title: 'Многодетным семьям' })
    related.push({ slug: 'studenty', title: 'На детей-студентов' })
  }
  
  if (slug.includes('dohod')) {
    related.push({ slug: 'samozanyatym', title: 'Для самозанятых' })
    related.push({ slug: 'alimenty', title: 'Учет алиментов' })
  }
  
  if (slug.includes('imushchestv')) {
    related.push({ slug: 'dve-kvartiry', title: 'При наличии двух квартир' })
    related.push({ slug: 'proverka-imushchestva', title: 'Проверка имущества' })
  }
  
  // Добавляем рандомные страницы если мало
  if (related.length < 3) {
    const randomSlugs = allSlugs
      .filter(s => s !== slug && !related.find(r => r.slug === s))
      .slice(0, 3 - related.length)
    
    randomSlugs.forEach(s => {
      const data = getPageData(s)
      if (data) {
        related.push({ slug: s, title: data.h1 })
      }
    })
  }
  
  return related.slice(0, 4)
})

// SEO мета-теги
useSeoMeta({
  title: pageData.title,
  description: pageData.description,
  keywords: pageData.keywords,
  ogTitle: pageData.title,
  ogDescription: pageData.description,
  ogType: 'website'
})

// Структурированные данные для поисковиков
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: pageData.title,
        description: pageData.description,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'RUB'
        }
      })
    }
  ]
})
</script>

<style scoped>
.calculator-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.seo-header {
  margin-bottom: 40px;
  text-align: center;
}

.seo-header h1 {
  font-size: 32px;
  line-height: 1.3;
  color: #1a1d1f;
  margin-bottom: 20px;
  font-weight: 700;
}

.lead-text {
  font-size: 18px;
  line-height: 1.6;
  color: #6f767e;
  max-width: 800px;
  margin: 0 auto 30px;
}

.intro-section {
  background: #f0f7ff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.intro-section p {
  margin: 0;
  line-height: 1.6;
  color: #1a1d1f;
}

.hint-box {
  background: #fff9e6;
  border: 1px solid #ffd166;
  border-radius: 12px;
  padding: 16px 20px;
  margin: 20px auto 30px;
  max-width: 800px;
}

.hint-box p {
  margin: 0;
  color: #B45309;
  font-size: 15px;
  line-height: 1.5;
}

.seo-content {
  margin-top: 60px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.info-section {
  margin-bottom: 40px;
  padding: 30px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.info-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #1a1d1f;
  font-weight: 600;
}

.info-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-section li {
  padding: 12px 0;
  padding-left: 32px;
  position: relative;
  line-height: 1.6;
  color: #495057;
  border-bottom: 1px solid #f0f2f5;
}

.info-section li:last-child {
  border-bottom: none;
}

.info-section li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
  font-size: 18px;
}

.related-pages {
  margin-top: 60px;
  padding: 30px;
  background: #f8fafc;
  border-radius: 16px;
}

.related-pages h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #1a1d1f;
}

.related-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.related-link {
  display: block;
  padding: 15px 20px;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  color: #008cff;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.related-link:hover {
  background: #f0f7ff;
  border-color: #008cff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 140, 255, 0.15);
}

.faq-section {
  margin-top: 60px;
  padding: 40px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%);
  border-radius: 16px;
}

.faq-section h2 {
  font-size: 28px;
  margin-bottom: 30px;
  color: #1a1d1f;
  text-align: center;
}

.faq-item {
  margin-bottom: 30px;
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.faq-item h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #1a1d1f;
  font-weight: 600;
}

.faq-item p {
  margin: 0;
  line-height: 1.6;
  color: #6f767e;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .calculator-page {
    padding: 15px;
  }
  
  .seo-header h1 {
    font-size: 24px;
  }
  
  .lead-text {
    font-size: 16px;
  }
  
  .hint-box {
    margin: 15px 10px 25px;
  }
  
  .info-section {
    padding: 20px;
  }
  
  .info-section h2 {
    font-size: 20px;
  }
  
  .related-links {
    grid-template-columns: 1fr;
  }
  
  .faq-section {
    padding: 20px;
  }
  
  .faq-item {
    padding: 20px;
  }
}
</style>