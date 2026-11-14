export default class SenderService {
    async sendNotification(userId, notificationId) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.info(`Sent ${notificationId} to ${userId}`);
    }
}
