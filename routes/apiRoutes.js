const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userCreate');
const { sendNotification, getUserNotifications } = require('../controllers/notification');

// User routes
router.post('/users', createUser);

// Notification routes
router.post('/notifications', sendNotification);
router.get('/users/:id/notifications', getUserNotifications);

module.exports = router;
