import { regions } from '~/data/regions.js'
import { getCalculatorPagesForSitemap } from '~/data/calculatorPages.js'
import { getAllArticles, getAllCategories } from '~/server/utils/content'

export default defineSitemapEventHandler(() => {
  const routes = []
  
  // Основные страницы
  routes.push({
    loc: '/',
    changefreq: 'weekly',
    priority: 1
  })
  
  routes.push({
    loc: '/edinoe-posobie',
    changefreq: 'weekly',
    priority: 0.9
  })
  
  routes.push({
    loc: '/edinoe-posobie/calculator',
    changefreq: 'weekly',
    priority: 0.9
  })
  
  // Страницы списков регионов
  routes.push({
    loc: '/edinoe-posobie/calculator/beremennym',
    changefreq: 'monthly',
    priority: 0.8
  })
  
  routes.push({
    loc: '/edinoe-posobie/calculator/detyam',
    changefreq: 'monthly',
    priority: 0.8
  })
  
  // Страницы для каждого региона
  regions.forEach(region => {
    routes.push({
      loc: `/edinoe-posobie/calculator/beremennym/${region.code}`,
      changefreq: 'monthly',
      priority: 0.7
    })
    
    routes.push({
      loc: `/edinoe-posobie/calculator/detyam/${region.code}`,
      changefreq: 'monthly',
      priority: 0.7
    })
  })
  
  // Новые тематические страницы
  routes.push(...getCalculatorPagesForSitemap())
  
  // === БЛОГ ===
  
  // Главная страница блога
  routes.push({
    loc: '/blog',
    changefreq: 'daily',
    priority: 0.9
  })
  
  // Получаем все статьи и категории
  const articles = getAllArticles()
  const categories = getAllCategories()
  
  // Добавляем страницы категорий
  categories.forEach(category => {
    routes.push({
      loc: `/blog/${category}`,
      changefreq: 'weekly',
      priority: 0.8
    })
  })
  
  // Добавляем страницы статей
  articles.forEach(article => {
    routes.push({
      loc: `/blog/${article.category}/${article.slug}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: article.date || new Date().toISOString()
    })
  })
  
  return routes
})