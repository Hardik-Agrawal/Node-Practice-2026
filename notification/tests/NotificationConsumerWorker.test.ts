import assert from 'node:assert/strict';
import { test } from 'node:test';
import type NotificationJob from '../models/NotificationJob.js';
import NotificationConsumerWorker from '../workers/NotificationConsumerWorker.js';

test('delivers a fetched notification job to every subscribed user', async () => {
  const job: NotificationJob = {
    id: '1',
    notificationId: 42,
    queuedAt: '2026-11-03T00:00:00.000Z',
  };
  const fetchedNotificationIds: number[] = [];
  const sentNotifications: Array<{ userId: string; notificationId: number }> = [];
  let hasReturnedJob = false;
  let resolveDelivery!: () => void;
  const deliveryComplete = new Promise<void>((resolve) => {
    resolveDelivery = resolve;
  });

  const worker = new NotificationConsumerWorker(
    {
      async getUserList(notificationId) {
        fetchedNotificationIds.push(notificationId);
        return ['user-1', 'user-2'];
      },
    },
    {
      async fetch() {
        if (hasReturnedJob) return undefined;
        hasReturnedJob = true;
        return job;
      },
    },
    {
      async sendNotification(userId, notificationId) {
        sentNotifications.push({ userId, notificationId });
        if (sentNotifications.length === 2) resolveDelivery();
      },
    },
    1,
  );

  worker.start();
  await deliveryComplete;
  worker.stop();

  assert.deepEqual(fetchedNotificationIds, [42]);
  assert.deepEqual(sentNotifications, [
    { userId: 'user-1', notificationId: 42 },
    { userId: 'user-2', notificationId: 42 },
  ]);
});
