import type { Article } from '~/server/utils/content'

export const useBlog = () => {
  /**
   * Получить все категории
   */
  const getCategories = async () => {
    return await useFetch('/api/blog/categories')
  }

  /**
   * Получить статьи категории
   */
  const getCategoryArticles = async (category: string) => {
    return await useFetch<Article[]>(`/api/blog/${category}`)
  }

  /**
   * Получить одну статью
   */
  const getArticle = async (category: string, slug: string) => {
    return await useFetch<Article>(`/api/blog/${category}/${slug}`)
  }

  /**
   * Получить последние статьи
   */
  const getRecentArticles = async (limit: number = 6) => {
    return await useFetch<Article[]>(`/api/blog/recent?limit=${limit}`)
  }

  /**
   * Форматирование даты
   */
  const formatDate = (date: string): string => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return {
    getCategories,
    getCategoryArticles,
    getArticle,
    getRecentArticles,
    formatDate
  }
}
