export default class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
        this.subscribe = this.subscribe.bind(this);
    }
    async subscribe(req, res, next) {
        const { userId, notificationId } = req.params;
        console.info('Received subscription request', { userId, notificationId });
        try {
            const subscription = await this.userService.subscribeUser(userId, notificationId);
            console.info('Subscription request completed', { userId, notificationId });
            res.status(200).json({
                message: `User ${userId} subscribed to notification ${notificationId}`,
                subscription,
            });
        }
        catch (error) {
            console.error('Subscription request failed', { userId, notificationId, error });
            next(error);
        }
    }
}
