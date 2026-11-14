import type { Subscription } from '../repositories/IUserRepo.js';

export default interface UserServiceContract {
  subscribeUser(userId: string, notificationId: string): Promise<Subscription>;
}
