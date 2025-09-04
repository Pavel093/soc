import { regions } from '~/data/regions.js'
import { getCalculatorPagesForSitemap } from '~/data/calculatorPages.js'

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
  
  return routes
})