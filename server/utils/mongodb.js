import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async () => {
  if (isConnected) return

  try {
    // Убираем устаревшие опции
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/calculator-embed'
    )
    
    isConnected = true
    console.log('MongoDB подключена')
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error)
    throw error
  }
}
