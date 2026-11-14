export default class SenderController {
    senderService;
    constructor(senderService) {
        this.senderService = senderService;
        this.send = this.send.bind(this);
    }
    async send(req, res, next) {
        const { userId } = req.params;
        const notificationId = Number(req.params.notificationId);
        if (!Number.isInteger(notificationId) || notificationId <= 0) {
            res.status(400).json({ message: 'notificationId must be a positive integer' });
            return;
        }
        try {
            await this.senderService.sendNotification(userId, notificationId);
            res.status(200).json({ message: 'Notification sent', userId, notificationId });
        }
        catch (error) {
            next(error);
        }
    }
}
