import type { NextFunction, Request, Response } from 'express';

export default interface ISenderController {
  send(req: Request<{ userId: string; notificationId: string }>, res: Response, next: NextFunction): Promise<void>;
}
