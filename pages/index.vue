<script setup>
import Header from '~/components/Header.vue';
import HeroSection from '~/components/landing/home/HeroSection.vue';
import AllCards from '~/components/landing/home/AllCards.vue'
import AdvantagesSection from '~/components/landing/home/AdvantagesSection.vue'

// --- Полная SEO-оптимизация для главной страницы ---

// Определяем базовый URL сайта. Замените на свой, если он отличается.
const siteUrl = 'https://всепособия.рф';

useHead({
  htmlAttrs: {
    lang: 'ru'
  },
  title: 'Онлайн калькуляторы пособий и выплат на детей в 2025 году',
  
  link: [
    {
      rel: 'canonical',
      href: siteUrl,
    },
  ],

  meta: [
    {
      name: 'description',
      content: 'Точные и бесплатные онлайн-калькуляторы для расчета всех детских пособий и социальных выплат в 2025 году. Рассчитайте единое пособие, декретные, алименты, пособие до 1.5 лет, выплаты из маткапитала и семейную ипотеку. Актуально, анонимно и без регистрации.'
    },
    {
      name: 'keywords',
      content: 'пособия, выплаты, калькулятор, рассчитать, единое пособие, декретные, алименты, маткапитал, семейная ипотека, пособие до 1.5 лет, налоговый вычет, льготы, социальные выплаты, детские пособия 2024'
    },
    
    { property: 'og:title', content: 'Онлайн калькуляторы пособий и выплат на детей в 2025 году' },
    { property: 'og:description', content: 'Рассчитайте единое пособие, декретные, алименты, выплаты из маткапитала и другие льготы. Точно, бесплатно и анонимно.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: `${siteUrl}/og-image.png` }, 
    { property: 'og:locale', content: 'ru_RU' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Онлайн калькуляторы пособий и выплат на детей в 2025 году' },
    { name: 'twitter:description', content: 'Рассчитайте единое пособие, декретные, алименты, выплаты из маткапитала и другие льготы. Точно, бесплатно и анонимно.' },
    { name: 'twitter:image', content: `${siteUrl}/og-image.png` }, 
  ],

  // 4. Структурированные данные JSON-LD для расширенных сниппетов
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'url': siteUrl,
        'name': 'ВсеПособия.рф',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Насколько точны расчеты на калькуляторах?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Наши калькуляторы основаны на актуальном законодательстве 2025 года. Мы показываем формулы и ссылки на законы, чтобы вы могли проверить расчет. Однако, расчет является предварительным и носит ознакомительный характер.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Нужно ли платить за использование калькуляторов?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Нет, все калькуляторы на сайте абсолютно бесплатны для всех пользователей. Регистрация также не требуется.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Мои данные в безопасности?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Да, полностью. Мы не храним и не передаем введенные вами данные. Все расчеты производятся анонимно прямо в вашем браузере.'
            }
          }
        ]
      })
    }
  ],
})
</script>
