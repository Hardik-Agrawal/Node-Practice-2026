import type ISenderService from '../../services/ISenderService.js';
import type ISenderController from '../ISenderController.js';
import type { NextFunction, Request, Response } from 'express';

export default class SenderController implements ISenderController {
  constructor(private readonly senderService: ISenderService) {
    this.send = this.send.bind(this);
  }

  async send(req: Request<{ userId: string; notificationId: string }>, res: Response, next: NextFunction): Promise<void> {
    const { userId } = req.params;
    const notificationId = Number(req.params.notificationId);
    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      res.status(400).json({ message: 'notificationId must be a positive integer' });
      return;
    }

    try {
      await this.senderService.sendNotification(userId, notificationId);
      res.status(200).json({ message: 'Notification sent', userId, notificationId });
    } catch (error) {
      next(error);
    }
  }
}
