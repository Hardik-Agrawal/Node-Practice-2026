import type IUserRepo from '../../repositories/IUserRepo.js';
import type IUserService from '../IUserService.js';
import type { Subscription } from '../../repositories/IUserRepo.js';

export default class UserService implements IUserService {
  constructor(private readonly userRepo: IUserRepo) {
  }

  async subscribeUser(userId: string, notificationId: string): Promise<Subscription> {
    console.info('Subscribing user to notification', { userId, notificationId });

    try {
      const subscription = await this.userRepo.subscribe(userId, notificationId);
      console.info('User subscription processed', { userId, notificationId });
      return subscription;
    } catch (error) {
      console.error('User subscription failed in service', { userId, notificationId, error });
      throw error;
    }
  }
}
