import { AddRuleStatus, DeleteRuleStatus } from "../../model/RuleStatus.js";
import type { TokenManager } from "../TokenManager.js";

// TODO: Manage how the [forwardRequest] is handled when rules are being added or deleted.
export class BucketTokenManager implements TokenManager {
  private readonly userBuckets = new Map<string, LeakyBucket[]>();
  private readonly rules: Array<{ duration: number; capacity: number }> = [];

  forwardRequest(userId: string): boolean {
    let buckets = this.userBuckets.get(userId);
    if (!buckets) {
      buckets = this.rules.map(({ duration, capacity }) => new LeakyBucket(duration, capacity));
      this.userBuckets.set(userId, buckets);
    }

    // TODO: Check how to merge, hasToken() and getToken()
    if (buckets.some((bucket) => !bucket.hasToken())) {
      return false;
    }

    for (const bucket of buckets) {
      bucket.getToken();
    }
    return true;
  }

  addRule(duration: number, capacity: number): AddRuleStatus {
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isInteger(capacity) || capacity <= 0) {
      return AddRuleStatus.FAILED;
    }

    const ruleIndex = this.rules.findIndex((rule) => rule.duration === duration);
    if (ruleIndex === -1) {
      this.rules.push({ duration, capacity });
      for (const buckets of this.userBuckets.values()) {
        buckets.push(new LeakyBucket(duration, capacity));
      }
      return AddRuleStatus.ADDED;
    }

    this.rules[ruleIndex] = { duration, capacity };
    for (const buckets of this.userBuckets.values()) {
      const bucketIndex = buckets.findIndex((bucket) => bucket.refillDuration === duration);
      if (bucketIndex !== -1) {
        buckets[bucketIndex] = new LeakyBucket(duration, capacity);
      }
    }
    return AddRuleStatus.MODIFIED;
  }

  deleteRule(duration: number): DeleteRuleStatus {
    const ruleIndex = this.rules.findIndex((rule) => rule.duration === duration);
    if (ruleIndex === -1) {
      return DeleteRuleStatus.NOT_FOUND;
    }

    if(this.rules.length === 1) {
      return DeleteRuleStatus.FAILED;
    }

    this.rules.splice(ruleIndex, 1);
    for (const [userId, buckets] of this.userBuckets) {
      this.userBuckets.set(
        userId,
        buckets.filter((bucket) => bucket.refillDuration !== duration),
      );
    }
    return DeleteRuleStatus.DELETED;
  }
}

class LeakyBucket {
  tokenCount: number;
  lastRefillEpoch: number;
  readonly refillDuration: number;
  readonly maxCapacity: number;

  constructor(refillDuration: number, maxCapacity: number) {
    this.tokenCount = maxCapacity;
    this.refillDuration = refillDuration;
    this.maxCapacity = maxCapacity;
    this.lastRefillEpoch = Date.now();
  }

  getToken(): boolean {
    if (!this.hasToken()) {
      return false;
    }

    if (this.tokenCount <= 0) {
      this.tokenCount = this.maxCapacity;
      this.lastRefillEpoch = Date.now();
    }

    this.tokenCount -= 1;
    return true;
  }

  hasToken(): boolean {
    return this.tokenCount > 0 || this.lastRefillEpoch + this.refillDuration <= Date.now();
  }
}

