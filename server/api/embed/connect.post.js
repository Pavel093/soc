import { connectDB } from '../../utils/mongodb'
import Domain from '../../models/Domain'
import Statistics from '../../models/Statistics'

export default defineEventHandler(async (event) => {
  console.log('📥 Connect endpoint вызван')
  
  await connectDB()
  
  try {
    const body = await readBody(event)
    const { domain, pageUrl, userAgent, sessionId } = body
    
    console.log('📊 Получены данные:', { domain, pageUrl, sessionId })
    
    // Простой способ получить IP без импортов
    let ipAddress = '127.0.0.1'
    
    try {
      // Пробуем разные способы получить IP
      ipAddress = event.node?.req?.headers?.['x-forwarded-for'] ||
                  event.node?.req?.connection?.remoteAddress ||
                  event.node?.req?.socket?.remoteAddress ||
                  '127.0.0.1'
      
      // Очищаем IP от IPv6 префикса
      ipAddress = ipAddress.replace(/^::ffff:/, '')
    } catch (e) {
      console.log('⚠️ Не удалось получить IP:', e)
    }
    
    console.log('🌐 IP адрес:', ipAddress)
    
    // Проверяем или создаем домен
    let domainRecord = await Domain.findOne({ domain })
    console.log('🔍 Найден домен:', domainRecord)
    
    if (!domainRecord) {
      // Первый раз видим этот домен - создаем запись
      domainRecord = await Domain.create({
        domain,
        firstSeen: new Date(),
        lastSeen: new Date(),
        totalViews: 1
      })
      console.log('✅ Создан новый домен:', domainRecord)
    } else {
      // Обновляем существующий домен
      domainRecord.lastSeen = new Date()
      domainRecord.totalViews += 1
      await domainRecord.save()
      console.log('📈 Обновлен домен:', domainRecord)
    }
    
    // Создаем запись статистики
    const stat = await Statistics.create({
      domain,
      pageUrl,
      userAgent,
      ipAddress,
      sessionId,
      referrer: pageUrl
    })
    console.log('📝 Создана статистика:', stat)
    
    // Возвращаем статус
    return {
      success: true,
      blocked: domainRecord.isBlocked,
      domain: domain
    }
  } catch (error) {
    console.error('❌ Ошибка в connect.post:', error)
    return {
      success: false,
      blocked: false,
      error: error.message
    }
  }
})
