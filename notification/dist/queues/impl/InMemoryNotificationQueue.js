export default class InMemoryNotificationQueue {
    jobs = [];
    nextId = 1;
    enqueue(notificationId) {
        const job = {
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
    dequeue() {
        return this.jobs.shift();
    }
}
