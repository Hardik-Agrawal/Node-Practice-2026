import type NotificationJob from '../models/NotificationJob.js';

export default interface INotificationService {
  postNotification(notificationId: number): Promise<NotificationJob>;
  pollNotification(): NotificationJob | undefined;
}
