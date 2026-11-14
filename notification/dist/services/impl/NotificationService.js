export default class NotificationService {
    notificationQueue;
    constructor(notificationQueue) {
        this.notificationQueue = notificationQueue;
    }
    async postNotification(notificationId) {
        console.info('Preparing notification for queue', { notificationId });
        try {
            const job = this.notificationQueue.enqueue(notificationId);
            console.info('Notification queued', {
                notificationId,
                jobId: job.id,
            });
            return job;
        }
        catch (error) {
            console.error('Failed to queue notification', { notificationId, error });
            throw error;
        }
    }
    pollNotification() {
        const job = this.notificationQueue.dequeue();
        if (job) {
            console.info('Notification removed from queue for processing', { jobId: job.id });
        }
        else {
            console.info('Notification queue is empty');
        }
        return job;
    }
}
