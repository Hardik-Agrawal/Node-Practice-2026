import NotificationFetchClient from '../clients/NotificationFetchClient.js';
import SenderClient from '../clients/SenderClient.js';
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
export default class NotificationConsumerWorker {
    notificationRepo;
    notificationClient;
    senderClient;
    pollIntervalMs;
    running = false;
    constructor(notificationRepo, notificationClient = new NotificationFetchClient(), senderClient = new SenderClient(), pollIntervalMs = Number(process.env.CONSUMER_POLL_INTERVAL_MS ?? 1000)) {
        this.notificationRepo = notificationRepo;
        this.notificationClient = notificationClient;
        this.senderClient = senderClient;
        this.pollIntervalMs = pollIntervalMs;
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        console.info('Notification consumer worker started');
        void this.run();
    }
    stop() {
        this.running = false;
    }
    async run() {
        while (this.running) {
            try {
                const job = await this.notificationClient.fetch();
                if (job) {
                    await this.send(job);
                }
                else {
                    await wait(this.pollIntervalMs);
                }
            }
            catch (error) {
                console.error('Notification consumer worker iteration failed', error);
            }
        }
    }
    async send(job) {
        const userIds = await this.notificationRepo.getUserList(job.notificationId);
        for (const userId of userIds) {
            await this.senderClient.sendNotification(userId, job.notificationId);
        }
        console.info('Notification delivered to subscribed users', {
            jobId: job.id,
            notificationId: job.notificationId,
            userCount: userIds.length,
        });
    }
}
