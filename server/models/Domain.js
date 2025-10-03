import mongoose from 'mongoose'

const domainSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  firstSeen: {
    type: Date,
    default: Date.now
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  totalViews: {
    type: Number,
    default: 0
  },
  blockedReason: String,
  metadata: {
    siteName: String,
    contactEmail: String
  }
}, {
  timestamps: true
})

export default mongoose.models.Domain || mongoose.model('Domain', domainSchema)
