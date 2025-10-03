import { connectDB } from '../../utils/mongodb'
import Statistics from '../../models/Statistics'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  // Проверка токена
  const token = getCookie(event, 'admin-token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Не авторизован' })
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Недействительный токен' })
  }
  
  const query = getQuery(event)
  const { domain, limit = 100 } = query
  
  const filter = domain ? { domain } : {}
  
  const stats = await Statistics
    .find(filter)
    .sort('-createdAt')
    .limit(Number(limit))
  
  // Сводная статистика
  const summary = await Statistics.aggregate([
    {
      $group: {
        _id: null,
        totalViews: { $sum: 1 },
        uniqueDomains: { $addToSet: '$domain' },
        uniqueIPs: { $addToSet: '$ipAddress' }
      }
    }
  ])
  
  return {
    statistics: stats,
    summary: {
      totalViews: summary[0]?.totalViews || 0,
      uniqueDomains: summary[0]?.uniqueDomains?.length || 0,
      uniqueVisitors: summary[0]?.uniqueIPs?.length || 0
    }
  }
})
