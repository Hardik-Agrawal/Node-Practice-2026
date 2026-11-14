import type IUserService from '../../services/IUserService.js';
import type IUserController from '../IUserController.js';
import type { NextFunction, Request, Response } from 'express';

export default class UserController implements IUserController {
  constructor(private readonly userService: IUserService) {
    this.subscribe = this.subscribe.bind(this);
  }

  async subscribe(req: Request<{ userId: string; notificationId: string }>, res: Response, next: NextFunction): Promise<void> {
    const { userId, notificationId } = req.params;
    console.info('Received subscription request', { userId, notificationId });

    try {
      const subscription = await this.userService.subscribeUser(userId, notificationId);
      console.info('Subscription request completed', { userId, notificationId });

      res.status(200).json({
        message: `User ${userId} subscribed to notification ${notificationId}`,
        subscription,
      });
    } catch (error) {
      console.error('Subscription request failed', { userId, notificationId, error });
      next(error);
    }
  }
}
