import type NotificationJob from '../models/NotificationJob.js';

export default class NotificationFetchClient {
  constructor(
    private readonly baseUrl = process.env.NOTIFICATION_SERVICE_URL ?? 'http://localhost:3000',
  ) {}

  async fetch(): Promise<NotificationJob | undefined> {
    const response = await globalThis.fetch(`${this.baseUrl}/notifications/pull`);

    if (response.status === 204) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(`Notification fetch failed with status ${response.status}`);
    }

    return (await response.json()) as NotificationJob;
  }
}
