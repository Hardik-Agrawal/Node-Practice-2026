export default interface INotificationRepo {
  getUserList(notificationId: number): Promise<string[]>;
}
