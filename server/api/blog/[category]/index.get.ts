import { getArticlesByCategory } from '~/server/utils/content'

export default defineEventHandler((event) => {
  const category = getRouterParam(event, 'category')
  
  console.log('API [category]/index.get: Loading articles for category:', category)
  
  if (!category) {
    throw createError({
      statusCode: 400,
      message: 'Category is required'
    })
  }
  
  const articles = getArticlesByCategory(category, false)
  
  console.log('API [category]/index.get: Articles loaded:', articles.length)
  
  return articles
})
