import { getAllCategories, getArticlesByCategory } from '~/server/utils/content'
import { blogCategories } from '~/data/blogCategories'

export default defineEventHandler(() => {
  console.log('API: Loading categories')
  
  const categories = getAllCategories()
  
  const result = blogCategories.filter(cat => categories.includes(cat.slug)).map(cat => ({
    ...cat,
    articlesCount: getArticlesByCategory(cat.slug).length
  }))
  
  console.log('API: Categories loaded:', result.length)
  
  return result
})
