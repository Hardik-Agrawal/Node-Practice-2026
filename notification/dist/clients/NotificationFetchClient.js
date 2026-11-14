export default class NotificationFetchClient {
    baseUrl;
    constructor(baseUrl = process.env.NOTIFICATION_SERVICE_URL ?? 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }
    async fetch() {
        const response = await globalThis.fetch(`${this.baseUrl}/notifications/pull`);
        if (response.status === 204) {
            return undefined;
        }
        if (!response.ok) {
            throw new Error(`Notification fetch failed with status ${response.status}`);
        }
        return (await response.json());
    }
}
