import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Article {
  slug: string
  category: string
  title: string
  description: string
  date: string
  author?: string
  image?: string
  tags?: string[]
  content: string
  html?: string
  readTime: string
}

const contentDir = path.join(process.cwd(), 'server/content/blog') 

/**
 * Расчет времени чтения
 */
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} мин`
}

/**
 * Получить все категории
 */
export function getAllCategories(): string[] {
  if (!fs.existsSync(contentDir)) {
    console.log('Content directory does not exist:', contentDir)
    return []
  }
  
  const items = fs.readdirSync(contentDir).filter(item => {
    const itemPath = path.join(contentDir, item)
    return fs.statSync(itemPath).isDirectory()
  })
  
  console.log('Found categories:', items)
  return items
}

/**
 * Получить все статьи из категории
 */
export function getArticlesByCategory(category: string, includeContent: boolean = false): Article[] {
  const categoryPath = path.join(contentDir, category)
  
  if (!fs.existsSync(categoryPath)) {
    console.log('Category directory does not exist:', categoryPath)
    return []
  }
  
  const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.md'))
  
  console.log(`Found ${files.length} articles in category ${category}`)
  
  const articles = files.map(file => {
    const filePath = path.join(categoryPath, file)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    const article: Article = {
      slug: file.replace('.md', ''),
      category,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      author: data.author,
      image: data.image,
      tags: data.tags || [],
      content: includeContent ? content : '',
      readTime: calculateReadTime(content)
    }
    
    return article
  })
  
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Получить одну статью
 */
export function getArticle(category: string, slug: string): Article | null {
  const filePath = path.join(contentDir, category, `${slug}.md`)
  
  console.log('Looking for article at:', filePath)
  
  if (!fs.existsSync(filePath)) {
    console.log('Article file does not exist')
    return null
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return {
    slug,
    category,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    author: data.author,
    image: data.image,
    tags: data.tags || [],
    content,
    readTime: calculateReadTime(content)
  }
}

/**
 * Получить все статьи
 */
export function getAllArticles(): Article[] {
  const categories = getAllCategories()
  const articles: Article[] = []
  
  categories.forEach(category => {
    articles.push(...getArticlesByCategory(category, false))
  })
  
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}