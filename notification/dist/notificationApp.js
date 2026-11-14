import express from 'express';
import NotificationController from './controllers/impl/NotificationController.js';
import NotificationService from './services/impl/NotificationService.js';
import InMemoryNotificationQueue from './queues/impl/InMemoryNotificationQueue.js';
const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3000;
const notificationQueue = new InMemoryNotificationQueue();
const notificationService = new NotificationService(notificationQueue);
const notificationController = new NotificationController(notificationService);
app.use(express.json());
app.post('/notifications/push/:notificationId', notificationController.push);
app.get('/notifications/pull', notificationController.pull);
app.listen(PORT, () => {
    console.log(`Notification server is live on http://localhost:${PORT}`);
});
