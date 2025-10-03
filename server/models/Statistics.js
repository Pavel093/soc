import mongoose from 'mongoose'

const statisticsSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    index: true
  },
  pageUrl: String,
  referrer: String,
  userAgent: String,
  ipAddress: String,
  region: String,
  calculatorType: {
    type: String,
    default: 'edinoe-posobie'
  },
  sessionId: String,
  events: [{
    type: String,
    data: mongoose.Schema.Types.Mixed,
    timestamp: Date
  }]
}, {
  timestamps: true
})

// Индекс для быстрого поиска по дате
statisticsSchema.index({ createdAt: -1 })
statisticsSchema.index({ domain: 1, createdAt: -1 })

export default mongoose.models.Statistics || mongoose.model('Statistics', statisticsSchema)
