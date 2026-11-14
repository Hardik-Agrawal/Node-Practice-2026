export interface Subscription {
  userId: string;
  notificationId: string;
}

export default interface UserRepoContract {
  subscribe(userId: string, notificationId: string): Promise<Subscription>;
}
