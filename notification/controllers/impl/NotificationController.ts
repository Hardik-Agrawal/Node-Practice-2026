import type INotificationService from '../../services/INotificationService.js';
import type INotificationController from '../INotificationController.js';
import type { NextFunction, Request, Response } from 'express';

export default class NotificationController implements INotificationController {
  constructor(private readonly notificationService: INotificationService) {
    this.push = this.push.bind(this);
    this.pull = this.pull.bind(this);
  }

  async push(req: Request<{ notificationId: string }>, res: Response, next: NextFunction): Promise<void> {
    const notificationId = Number(req.params.notificationId);
    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      res.status(400).json({ message: 'notificationId must be a positive integer' });
      return;
    }

    try {
      const job = await this.notificationService.postNotification(notificationId);
      res.status(202).json({
        message: 'Notification accepted for processing',
        notificationId: job.notificationId,
        jobId: job.id,
      });
    } catch (error) {
      next(error);
    }
  }

  async pull(_req: Request, res: Response, next: NextFunction): Promise<void> {
    // TODO: Remove the element from queue only when the sender service confirms that it has successfully sent the notification. For now, we are removing it immediately.
    try {
      const job = this.notificationService.pollNotification();
      if (!job) {
        res.status(204).end();
        return;
      }

      res.status(200).json(job);
    } catch (error) {
      next(error);
    }
  }
}
