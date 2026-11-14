export default class UserRepo {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async subscribe(userId, notificationId) {
        console.info('Inserting subscription into database', { userId, notificationId });
        try {
            await this.pool.query('INSERT INTO notification_recipients (user_id, notification_id) VALUES ($1, $2)', [userId, notificationId]);
            console.info('Subscription inserted into database', { userId, notificationId });
        }
        catch (error) {
            console.error('Database subscription insert failed', { userId, notificationId, error });
            throw error;
        }
        return { userId, notificationId };
    }
}
