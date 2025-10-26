import { getAllArticles } from '~/server/utils/content'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const limit = Number(query.limit) || 6
  
  console.log('API: Loading recent articles, limit:', limit)
  
  const articles = getAllArticles()
  const result = articles.slice(0, limit)
  
  console.log('API: Recent articles loaded:', result.length)
  
  return result
})
