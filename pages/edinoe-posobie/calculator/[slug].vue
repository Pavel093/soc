<template>
  <div class="calculator-page">
    <!-- Hero-секция для страницы -->
    <div class="page-hero">
      <div class="page-hero__background">
        <svg viewBox="0 0 1403 723" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <g filter="url(#filter0_n_246_41)">
            <rect width="1403" height="723" fill="url(#paint0_radial_246_41)"/>
            <rect width="1403" height="723" fill="url(#paint1_radial_246_41)"/>
            <rect width="1403" height="723" fill="url(#paint2_radial_246_41)"/>
          </g>
          <defs>
            <filter id="filter0_n_246_41" x="0" y="0" width="1403" height="723" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feTurbulence type="fractalNoise" baseFrequency="1 1" stitchTiles="stitch" numOctaves="3" result="noise" seed="107" />
              <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
              </feComponentTransfer>
              <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
              <feFlood flood-color="rgba(255, 255, 255, 0.18)" result="color1Flood" />
              <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
              <feMerge result="effect1_noise_246_41">
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <radialGradient id="paint0_radial_246_41" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(371 434.5) rotate(31.5978) scale(387.439 298.127)">
              <stop stop-color="#22C4FF"/>
              <stop offset="1" stop-color="white" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="paint1_radial_246_41" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1045 441) rotate(140.053) scale(285.011 384.132)">
              <stop stop-color="#FF48B6"/>
              <stop offset="1" stop-color="white" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="paint2_radial_246_41" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(702 361) rotate(90) scale(332.5 448.137)">
              <stop stop-color="#6C4BFF" stop-opacity="0.85"/>
              <stop offset="1" stop-color="white" stop-opacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      <div class="page-hero__gradient-overlay"></div>
      
      <div class="page-hero__container">
        <div class="page-hero__content">
          <h1 class="page-hero__title">
            {{ pageData.h1 }}
          </h1>
          
          <p class="page-hero__description">
            {{ pageData.description }}
          </p>
          
          <!-- Вводный текст -->
          <div class="page-hero__intro" v-if="pageData.content?.intro">
            <p>{{ pageData.content.intro }}</p>
          </div>
          
          <!-- Подсказка по использованию -->
          <div v-if="pageData.content?.hint" class="page-hero__hint">
            <p>{{ pageData.content.hint }}</p>
          </div>
        </div>
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

      <!-- FAQ секция в стиле компонента FAQ -->
      <div class="faq-section">
        <h2 class="faq-title">
          Частые <span class="faq-title__accent">вопросы</span>
        </h2>
        
        <div class="faq-list">
          <div
            v-for="(item, index) in faqItems"
            :key="index"
            class="faq-item"
            :class="{ 'faq-item--active': item.isOpen }"
            @click="toggleFaq(index)"
          >
            <div class="faq-item__header">
              <h3 class="faq-item__question">{{ item.question }}</h3>
              <div class="faq-item__icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path v-if="!item.isOpen" d="M10 4V16M16 10H4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path v-else d="M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </div>
            <transition
              name="faq-slide"
              @enter="enter"
              @after-enter="afterEnter"
              @leave="leave"
            >
              <div v-if="item.isOpen" class="faq-item__answer">
                <p>{{ item.answer }}</p>
              </div>
            </transition>
          </div>
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

// FAQ данные
const faqItems = ref([
  {
    question: "Как рассчитывается единое пособие?",
    answer: "Единое пособие рассчитывается исходя из прожиточного минимума в вашем регионе. Размер может составлять 50%, 75% или 100% от ПМ в зависимости от доходов семьи.",
    isOpen: false
  },
  {
    question: "Кто имеет право на единое пособие?",
    answer: "Право имеют беременные женщины, вставшие на учет до 12 недель, и родители детей до 17 лет при соблюдении условий по доходам и имуществу.",
    isOpen: false
  },
  {
    question: "Какой расчетный период используется?",
    answer: "Учитываются доходы за 12 месяцев, которые предшествуют месяцу до месяца обращения. Например, при подаче в январе 2025 учитывается период с декабря 2023 по ноябрь 2024.",
    isOpen: false
  },
  {
    question: "Нужно ли платить или регистрироваться для расчета?",
    answer: "Нет! Калькулятор полностью бесплатный, анонимный и не требует регистрации. Все расчеты происходят прямо в вашем браузере.",
    isOpen: false
  }
]);

// Функция для переключения состояния FAQ
const toggleFaq = (index) => {
  faqItems.value[index].isOpen = !faqItems.value[index].isOpen;
};

// Анимации для плавного раскрытия
const enter = (el) => {
  el.style.height = 'auto';
  const height = getComputedStyle(el).height;
  el.style.height = '0';
  getComputedStyle(el);
  setTimeout(() => {
    el.style.height = height;
  });
};

const afterEnter = (el) => {
  el.style.height = 'auto';
};

const leave = (el) => {
  el.style.height = getComputedStyle(el).height;
  getComputedStyle(el);
  setTimeout(() => {
    el.style.height = '0';
  });
};

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

<style scoped lang="scss">
.calculator-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

// Hero секция в стиле главной страницы
.page-hero {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #ffffff;
  margin-bottom: 40px;
  border-radius: 25px;

  &__background {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    min-width: 1000px;
    z-index: 0;
    
    svg {
      width: 100%;
      height: 100%;
      opacity: 0.4;
    }
  }

  &__gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(248, 249, 251, 0) 0%,
      rgba(248, 249, 251, 0.2) 20%,
      rgba(248, 249, 251, 0.4) 40%,
      rgba(248, 249, 251, 0.6) 60%,
      rgba(248, 249, 251, 0.8) 80%,
      #f5f7fa 100%
    );
    pointer-events: none;
    z-index: 5;
  }

  &__container {
    position: relative;
    z-index: 10;
    width: 100%;
    padding: 0 20px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  &__title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 clamp(20px, 3vw, 25px);
    color: rgb(0, 0, 0);
  }

  &__description {
    font-size: clamp(18px, 2.5vw, 24px);
    line-height: 1.4;
    color: #3A3A3A;
    margin: 0 0 clamp(20px, 3vw, 25px);
    max-width: 800px;
    width: 100%;
  }

  &__intro {
    background: #f0f7ff;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 20px;
    max-width: 800px;
    
    p {
      margin: 0;
      line-height: 1.6;
      color: #1a1d1f;
      font-size: 16px;
    }
  }

  &__hint {
    background: #fff9e6;
    border: 1px solid #ffd166;
    border-radius: 12px;
    padding: 16px 20px;
    margin: 15px auto;
    max-width: 800px;
    
    p {
      margin: 0;
      color: #B45309;
      font-size: 15px;
      line-height: 1.5;
    }
  }
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
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  h2 {
    font-size: 28px;
    margin-bottom: 20px;
    color: #1a1d1f;
    font-weight: 600;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    padding: 12px 0;
    padding-left: 32px;
    position: relative;
    line-height: 1.6;
    color: #495057;
    border-bottom: 1px solid #f0f2f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    &::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
      font-size: 18px;
    }
  }
}

.related-pages {
  margin-top: 60px;
  padding: 30px;
  background: #f8fafc;
  border-radius: 20px;
  
  h3 {
    font-size: 24px;
    margin-bottom: 25px;
    color: #1a1d1f;
    text-align: center;
  }
}

.related-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.related-link {
  display: block;
  padding: 18px 20px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #1775F6;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
  text-align: center;
  
  &:hover {
    background: #f0f7ff;
    border-color: #1775F6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(23, 117, 246, 0.15);
  }
}

// FAQ секция в стиле компонента FAQ
.faq-section {
  margin-top: 60px;
  
  .faq-title {
    font-size: 36px;
    font-weight: 700;
    text-align: center;
    color: #1a1a1a;
    margin-bottom: 40px;
    
    &__accent {
      color: #1775F6;
    }
  }
  
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .faq-item {
    background: #ffffff;
    border-radius: 20px;
    padding: 25px 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #eef2f7;
    }
    
    &--active {
      .faq-item__icon {
        transform: rotate(180deg);
      }
    }
    
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
    
    &__question {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
      flex: 1;
    }
    
    &__icon {
      color: #2b7bf6;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }
    
    &__answer {
      overflow: hidden;
      transition: height 0.3s ease;
      
      p {
        font-size: 16px;
        line-height: 1.6;
        color: #6b7280;
        margin: 0;
        padding-top: 20px;
      }
    }
  }
}

// Анимации для FAQ
.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: height 0.3s ease;
}

// Мобильная адаптация
@media (max-width: 768px) {
  .calculator-page {
    padding: 15px;
  }
  
  .page-hero {
    min-height: 50vh;
    margin-bottom: 30px;
    
    &__background {
      min-width: 800px;
      
      svg {
        opacity: 0.3;
      }
    }
    
    &__gradient-overlay {
      height: 150px;
    }
    
    &__title {
      font-size: 28px;
    }
    
    &__description {
      font-size: 18px;
    }
    
    &__intro,
    &__hint {
      padding: 15px;
      margin: 10px 0;
    }
  }
  
  .info-section {
    padding: 20px;
    
    h2 {
      font-size: 22px;
    }
  }
  
  .related-links {
    grid-template-columns: 1fr;
  }
  
  .related-link {
    padding: 15px;
  }
  
  .faq-section {
    .faq-title {
      font-size: 28px;
      margin-bottom: 30px;
    }
    
    .faq-item {
      padding: 20px;
      
      &__question {
        font-size: 16px;
      }
      
      &__answer p {
        font-size: 14px;
      }
    }
  }
}

@media (max-width: 480px) {
  .page-hero {
    min-height: 40vh;
    
    &__title {
      font-size: 24px;
    }
    
    &__description {
      font-size: 16px;
    }
  }
}
</style>