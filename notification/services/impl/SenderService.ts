import type ISenderService from '../ISenderService.js';

export default class SenderService implements ISenderService {
  async sendNotification(userId: string, notificationId: number): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    console.info(`Sent ${notificationId} to ${userId}`);
  }
}
