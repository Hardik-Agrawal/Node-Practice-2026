import type { TokenManager } from "../../repo/TokenManager.js";
import type { RateLimiterService } from "../RateLimiterService.js";

export class DefaultRateLimiterService implements RateLimiterService {
  constructor(private readonly tokenManager: TokenManager) {}

  forwardRequest(userId: string): boolean {
    return this.tokenManager.forwardRequest(userId);
  }
}
