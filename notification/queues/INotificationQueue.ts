import type NotificationJob from '../models/NotificationJob.js';

export default interface INotificationQueue {
  enqueue(notificationId: number): NotificationJob;
  dequeue(): NotificationJob | undefined;
}
