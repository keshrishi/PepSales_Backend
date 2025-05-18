const Notification = require('../models/Notification');
const User = require('../models/User');
const { getChannel } = require('../config/queue');

const VALID_TYPES = ['email', 'sms', 'in-app'];

exports.sendNotification = async (req, res) => {
  try {
    const { userId, type, content, metadata } = req.body;

    if (!userId || !type || !content) {
      return res.status(400).json({ error: 'userId, type, and content are required.' });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: `Invalid notification type. Must be one of: ${VALID_TYPES.join(', ')}` });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const notification = await Notification.create({
      userId,
      type,
      content,
      metadata,
      status: 'pending'
    });

    const channel = getChannel();
    if (!channel) {
      notification.status = 'failed';
      notification.error = 'Notification queue unavailable';
      await notification.save();
      return res.status(500).json({ error: 'Notification queue unavailable' });
    }

    try {
      channel.sendToQueue(
        'notifications',
        Buffer.from(JSON.stringify({ notificationId: notification._id })),
        { persistent: true }
      );
    } catch (queueError) {
      notification.status = 'failed';
      notification.error = queueError.message;
      await notification.save();
      return res.status(500).json({ error: 'Failed to queue notification' });
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id })
      .sort('-createdAt');
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    if (notification.type !== 'in-app') {
      return res.status(400).json({ error: 'Only in-app notifications can be marked as read.' });
    }
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
