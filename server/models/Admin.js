import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Хеширование пароля перед сохранением
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Метод проверки пароля
adminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password)
}

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema)
