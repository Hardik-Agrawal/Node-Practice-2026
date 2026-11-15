import type { AddRuleStatus, DeleteRuleStatus } from "../model/RuleStatus.js";

export interface TokenManagerService {
  addRule(duration: number, capacity: number): AddRuleStatus;
  deleteRule(duration: number): DeleteRuleStatus;
}
