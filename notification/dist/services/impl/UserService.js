export default class UserService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async subscribeUser(userId, notificationId) {
        console.info('Subscribing user to notification', { userId, notificationId });
        try {
            const subscription = await this.userRepo.subscribe(userId, notificationId);
            console.info('User subscription processed', { userId, notificationId });
            return subscription;
        }
        catch (error) {
            console.error('User subscription failed in service', { userId, notificationId, error });
            throw error;
        }
    }
}
