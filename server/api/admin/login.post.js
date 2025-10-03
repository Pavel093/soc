import { connectDB } from '../../utils/mongodb'
import Admin from '../../models/Admin'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  await connectDB()
  
  try {
    const { username, password } = await readBody(event)
    
    // Создаем админа если его нет (первый запуск)
    const adminCount = await Admin.countDocuments()
    if (adminCount === 0) {
      // Получаем данные из .env
      const adminUsername = process.env.ADMIN_USERNAME
      const adminPassword = process.env.ADMIN_PASSWORD
      
      await Admin.create({
        username: adminUsername,
        password: adminPassword 
      })
      
      console.log('Администратор создан с данными из .env')
    }
    
    // Ищем админа
    const admin = await Admin.findOne({ username })
    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Неверный логин или пароль'
      })
    }
    
    // Проверяем пароль
    const isValid = await admin.comparePassword(password)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Неверный логин или пароль'
      })
    }
    
    // Создаем токен
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    setCookie(event, 'admin-token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24
    })
    
    return { success: true, token }
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Ошибка входа'
    })
  }
})