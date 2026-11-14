export default class SenderClient {
    baseUrl;
    constructor(baseUrl = process.env.SENDER_SERVICE_URL ?? 'http://localhost:3001') {
        this.baseUrl = baseUrl;
    }
    async sendNotification(userId, notificationId) {
        const response = await globalThis.fetch(`${this.baseUrl}/send/${encodeURIComponent(userId)}/${notificationId}`, { method: 'POST' });
        if (!response.ok) {
            throw new Error(`Sender request failed for user ${userId} and notification ${notificationId}: ${response.status}`);
        }
    }
}
