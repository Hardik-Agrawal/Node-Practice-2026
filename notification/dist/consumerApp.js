import express from 'express';
import NotificationRepo from './repositories/impl/NotificationRepo.js';
import NotificationConsumerWorker from './workers/NotificationConsumerWorker.js';
import pool from './databases/postgres.js';
const app = express();
const PORT = process.env.CONSUMER_SERVICE_PORT || 3002;
const notificationRepo = new NotificationRepo(pool);
const worker = new NotificationConsumerWorker(notificationRepo);
app.get('/', (_req, res) => {
    res.status(200).json({ message: 'Notification consumer is running' });
});
const server = app.listen(PORT, () => {
    console.log(`Consumer server is live on http://localhost:${PORT}`);
    worker.start();
});
const shutdown = () => {
    worker.stop();
    server.close();
};
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
