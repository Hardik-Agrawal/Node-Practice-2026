export interface RateLimiterService {
  forwardRequest(userId: string): boolean;
}
