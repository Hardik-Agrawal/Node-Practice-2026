import { AddRuleStatus, DeleteRuleStatus } from "../model/RuleStatus.js";

export interface TokenManager {
  forwardRequest(userId: string): boolean;
  addRule(duration: number, capacity: number): AddRuleStatus;
  deleteRule(duration: number): DeleteRuleStatus;
}
