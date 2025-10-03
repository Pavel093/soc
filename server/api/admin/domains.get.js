import { connectDB } from '../../utils/mongodb'
import Domain from '../../models/Domain'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  console.log('📋 Запрос доменов для админки')
  
  await connectDB()
  
  // Проверка токена
  const token = getCookie(event, 'admin-token')
  if (!token) {
    console.log('❌ Нет токена')
    throw createError({
      statusCode: 401,
      statusMessage: 'Не авторизован'
    })
  }
  
  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch {
    console.log('❌ Невалидный токен')
    throw createError({
      statusCode: 401,
      statusMessage: 'Недействительный токен'
    })
  }
  
  // Получаем все домены
  const domains = await Domain.find({}).sort('-lastSeen').limit(100)
  console.log(`✅ Найдено доменов: ${domains.length}`)
  console.log('Домены:', domains)
  
  return domains
})
