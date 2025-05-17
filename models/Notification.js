const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['email', 'sms', 'in-app'], required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  retries: { type: Number, default: 0 },
  maxRetries: { type: Number, default: 3 },
  nextRetryAt: Date,
  error: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
