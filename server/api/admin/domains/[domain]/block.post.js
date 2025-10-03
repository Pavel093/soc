import { connectDB } from '../../../../utils/mongodb'
import Domain from '../../../../models/Domain'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  // Проверка авторизации
  const token = getCookie(event, 'admin-token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Не авторизован' })
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Недействительный токен' })
  }
  
  const domain = getRouterParam(event, 'domain')
  const { isBlocked, reason } = await readBody(event)
  
  // Обновляем статус домена
  await Domain.findOneAndUpdate(
    { domain },
    { 
      isBlocked,
      blockedReason: reason || null
    }
  )
  
  return { success: true }
})
