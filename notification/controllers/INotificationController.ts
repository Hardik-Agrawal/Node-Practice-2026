import type { NextFunction, Request, Response } from 'express';

export default interface INotificationController {
  push(req: Request<{ notificationId: string }>, res: Response, next: NextFunction): Promise<void>;
  pull(req: Request, res: Response, next: NextFunction): Promise<void>;
}
