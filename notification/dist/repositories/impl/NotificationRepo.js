export default class NotificationRepo {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async getUserList(notificationId) {
        console.info('Fetching subscribed users for notification', { notificationId });
        try {
            const result = await this.pool.query('SELECT user_id FROM notification_recipients WHERE notification_id = $1', [notificationId]);
            const userIds = result.rows.map(({ user_id }) => user_id);
            console.info('Fetched subscribed users for notification', {
                notificationId,
                userCount: userIds.length,
            });
            return userIds;
        }
        catch (error) {
            console.error('Failed to fetch subscribed users for notification', { notificationId, error });
            throw error;
        }
    }
}
