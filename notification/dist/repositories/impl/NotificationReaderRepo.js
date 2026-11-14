export default class NotificationReaderRepo {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async getUsersByNotificationId(notificationId) {
        console.info('Fetching users subscribed to notification', { notificationId });
        try {
            const result = await this.pool.query('SELECT user_id FROM subscriptions WHERE notification_id = $1', [notificationId]);
            const userIds = result.rows.map(({ user_id }) => user_id);
            console.info('Fetched users subscribed to notification', {
                notificationId,
                userCount: userIds.length,
            });
            return userIds;
        }
        catch (error) {
            console.error('Failed to fetch users subscribed to notification', { notificationId, error });
            throw error;
        }
    }
}
