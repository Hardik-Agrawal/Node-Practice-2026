import type IUserRepo from '../IUserRepo.js';
import type { Subscription } from '../IUserRepo.js';
import type { Pool } from 'pg';

export default class UserRepo implements IUserRepo {
  constructor(private readonly pool: Pool) {}

  async subscribe(userId: string, notificationId: string): Promise<Subscription> {
    console.info('Inserting subscription into database', { userId, notificationId });

    try {
      await this.pool.query(
        'INSERT INTO notification_recipients (user_id, notification_id) VALUES ($1, $2)',
        [userId, notificationId],
      );
      console.info('Subscription inserted into database', { userId, notificationId });
    } catch (error) {
      console.error('Database subscription insert failed', { userId, notificationId, error });
      throw error;
    }

    return { userId, notificationId };
  }
}
