import type { TokenManager } from "../../repo/TokenManager.js";
import type { TokenManagerService } from "../TokenManagerService.js";
import type { AddRuleStatus, DeleteRuleStatus } from "../../model/RuleStatus.js";

export class DefaultTokenManagerService implements TokenManagerService {
  constructor(private readonly tokenManager: TokenManager) {}

  addRule(duration: number, capacity: number): AddRuleStatus {
    return this.tokenManager.addRule(duration, capacity);
  }

  deleteRule(duration: number): DeleteRuleStatus {
    return this.tokenManager.deleteRule(duration);
  }
}
