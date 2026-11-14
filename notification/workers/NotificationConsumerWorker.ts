import NotificationFetchClient from '../clients/NotificationFetchClient.js';
import SenderClient from '../clients/SenderClient.js';
import type NotificationJob from '../models/NotificationJob.js';
import type INotificationRepo from '../repositories/INotificationRepo.js';

const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export default class NotificationConsumerWorker {
  private running = false;

  constructor(
    private readonly notificationRepo: INotificationRepo,
    private readonly notificationClient: Pick<NotificationFetchClient, 'fetch'> = new NotificationFetchClient(),
    private readonly senderClient: Pick<SenderClient, 'sendNotification'> = new SenderClient(),
    private readonly pollIntervalMs = Number(process.env.CONSUMER_POLL_INTERVAL_MS ?? 1000),
  ) {}

  start(): void {
    if (this.running) return;

    this.running = true;
    console.info('Notification consumer worker started');
    void this.run();
  }

  stop(): void {
    this.running = false;
  }

  private async run(): Promise<void> {
    while (this.running) {
      try {
        const job = await this.notificationClient.fetch();
        if (job) {
          await this.send(job);
        } else {
          await wait(this.pollIntervalMs);
        }
      } catch (error) {
        console.error('Notification consumer worker iteration failed', error);
      }
    }
  }

  private async send(job: NotificationJob): Promise<void> {
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
