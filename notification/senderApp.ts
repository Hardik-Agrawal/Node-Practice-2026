import express from 'express';
import SenderService from './services/impl/SenderService.js';
import SenderController from './controllers/impl/SenderController.js';

const app = express();
const PORT = process.env.SENDER_SERVICE_PORT || 3001;
const senderService = new SenderService();
const senderController = new SenderController(senderService);

app.use(express.json());
app.post('/send/:userId/:notificationId', senderController.send);

app.listen(PORT, () => {
  console.log(`Sender server is live on http://localhost:${PORT}`);
});
