import { connectDB } from '../../utils/mongodb'
import Statistics from '../../models/Statistics'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  try {
    const body = await readBody(event)
    const { domain, sessionId, eventType, eventData } = body
    
    // Находим сессию и добавляем событие
    const result = await Statistics.findOneAndUpdate(
      { sessionId, domain },
      {
        $push: {
          events: {
            type: eventType,
            data: eventData,
            timestamp: new Date()
          }
        }
      }
    )
    
    console.log('📊 Событие добавлено:', { domain, eventType, sessionId })
    
    return { success: true }
  } catch (error) {
    console.error('Ошибка трекинга события:', error)
    return { success: false }
  }
})
