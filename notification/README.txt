Functional
1 Remove notifications from the queue only when worker has successfully acknowledged
2 Have sender service add to a DB for successful chages

Performance

2 Use gRPC for passing data round (notificationService -> notificationClient) (readerRepo -> reader worker)
3 Multiple wokrers running at a time.

Refactor
1 Create a Sender client for notification consumer


On prod
1 Retry for consumer failure
2 Retry on sender failure