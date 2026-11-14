export default class SenderClient {
  constructor(private readonly baseUrl = process.env.SENDER_SERVICE_URL ?? 'http://localhost:3001') {}

  async sendNotification(userId: string, notificationId: number): Promise<void> {
    const response = await globalThis.fetch(
      `${this.baseUrl}/send/${encodeURIComponent(userId)}/${notificationId}`,
      { method: 'POST' },
    );

    if (!response.ok) {
      throw new Error(
        `Sender request failed for user ${userId} and notification ${notificationId}: ${response.status}`,
      );
    }
  }
}
