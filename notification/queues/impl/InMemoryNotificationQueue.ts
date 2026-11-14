import type INotificationQueue from '../INotificationQueue.js';
import type NotificationJob from '../../models/NotificationJob.js';

export default class InMemoryNotificationQueue implements INotificationQueue {
  private readonly jobs: NotificationJob[] = [];
  private nextId = 1;

  enqueue(notificationId: number): NotificationJob {
    const job: NotificationJob = {
      id: String(this.nextId++),
      notificationId,
      queuedAt: new Date().toISOString(),
    };

    this.jobs.push(job);
    console.info('Notification added to in-memory queue', {
      jobId: job.id,
      notificationId,
    });
    return job;
  }

  dequeue(): NotificationJob | undefined {
    return this.jobs.shift();
  }
}
