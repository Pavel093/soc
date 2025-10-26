import { getArticle } from '~/server/utils/content'
import { renderMarkdown } from '~/utils/markdown'

export default defineEventHandler((event) => {
  const category = getRouterParam(event, 'category')
  const slug = getRouterParam(event, 'slug')
  
  console.log('API [category]/[slug].get: Loading article:', { category, slug })
  
  if (!category || !slug) {
    throw createError({
      statusCode: 400,
      message: 'Category and slug are required'
    })
  }
  
  const article = getArticle(category, slug)
  
  if (!article) {
    console.log('API [category]/[slug].get: Article not found')
    throw createError({
      statusCode: 404,
      message: 'Article not found'
    })
  }
  
  // Рендерим markdown в HTML
  try {
    article.html = renderMarkdown(article.content)
    console.log('API [category]/[slug].get: Markdown rendered successfully')
  } catch (err) {
    console.error('API [category]/[slug].get: Markdown render error:', err)
    article.html = article.content
  }
  
  console.log('API [category]/[slug].get: Article loaded:', article.title)
  
  return article
})
