import type INotificationQueue from '../../queues/INotificationQueue.js';
import type INotificationService from '../INotificationService.js';
import type NotificationJob from '../../models/NotificationJob.js';

export default class NotificationService implements INotificationService {
  constructor(private readonly notificationQueue: INotificationQueue) {}

  async postNotification(notificationId: number) {
    console.info('Preparing notification for queue', { notificationId });

    try {
      const job = this.notificationQueue.enqueue(notificationId);
      console.info('Notification queued', {
        notificationId,
        jobId: job.id,
      });
      return job;
    } catch (error) {
      console.error('Failed to queue notification', { notificationId, error });
      throw error;
    }
  }

  pollNotification(): NotificationJob | undefined {
    const job = this.notificationQueue.dequeue();

    if (job) {
      console.info('Notification removed from queue for processing', { jobId: job.id });
    } else {
      console.info('Notification queue is empty');
    }

    return job;
  }
}
