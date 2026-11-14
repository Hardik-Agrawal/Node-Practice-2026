import express from 'express';
import UserRepo from './repositories/impl/UserRepo.js';
import UserService from './services/impl/UserService.js';
import UserController from './controllers/impl/UserController.js';
import pool from './databases/postgres.js';
const app = express();
const PORT = process.env.USER_SERVICE_PORT || 2000;
const userRepo = new UserRepo(pool);
const userService = new UserService(userRepo);
const userController = new UserController(userService);
app.use(express.json());
app.post('/subscribe/:userId/:notificationId', userController.subscribe);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'User Service is running' });
});
app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});
