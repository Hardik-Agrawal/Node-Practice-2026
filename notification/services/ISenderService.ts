export default interface ISenderService {
  sendNotification(userId: string, notificationId: number): Promise<void>;
}
