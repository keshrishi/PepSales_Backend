require('dotenv').config();
const mongoose = require('mongoose');
const { connectQueue, getChannel } = require('../config/queue');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail, sendSMS } = require('../utils/notificationSender');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Worker connected to MongoDB');
  } catch (err) {
    console.error('Worker MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB connection fails
  }
};

const sendNotification = async (notification, user) => {
  if (notification.type === 'email') {
    await sendEmail(user.email, 'Notification', notification.content);
  } else if (notification.type === 'sms') {
    await sendSMS(user.phone, notification.content);
  } else if (notification.type === 'in-app') {
    return true;
  }
  return true;
};

const processNotification = async (msg) => {
  const { notificationId } = JSON.parse(msg.content.toString());
  const notification = await Notification.findById(notificationId);
  if (!notification) return;
  const user = await User.findById(notification.userId);
  if (!user) return;

  try {
    await sendNotification(notification, user);
    notification.status = 'sent';
    await notification.save();
  } catch (error) {
    console.error(`Notification ${notificationId} failed: ${error.message}`);
    if (notification.retries < notification.maxRetries) {
      const delay = Math.pow(2, notification.retries) * 5000;
      notification.retries += 1;
      notification.nextRetryAt = new Date(Date.now() + delay);
      await notification.save();
      const channel = getChannel();
      channel.sendToQueue(
        'notifications',
        Buffer.from(JSON.stringify({ notificationId: notification._id })),
        { expiration: delay }
      );
    } else {
      notification.status = 'failed';
      notification.error = error.message;
      await notification.save();
    }
  }
};

(async () => {
  await connectDB(); // Connect to MongoDB first
  await connectQueue(); // Then connect to RabbitMQ

  const channel = getChannel();
  channel.consume('notifications', (msg) => {
    processNotification(msg);
    channel.ack(msg);
  });
  console.log('Notification worker started');
})();
