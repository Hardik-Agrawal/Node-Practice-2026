import { Router, type Request, type Response } from "express";
import { AddRuleStatus, DeleteRuleStatus } from "../../model/RuleStatus.js";
import type { TokenManagerService } from "../../service/TokenManagerService.js";

export class TokenManagerController {
  constructor(private readonly tokenManagerService: TokenManagerService) {}

  router(): Router {
    const router = Router();
    // TODO: Use middleware to validate and get request body and params instead of doing it in each handler.
    router.post("/rules", (request, response) => this.addRule(request, response));
    router.delete("/rules/:duration", (request, response) => this.deleteRule(request, response));
    return router;
  }

  private addRule(request: Request, response: Response): void {
    const { duration, capacity } = request.body ?? {};
    if (typeof duration !== "number" || typeof capacity !== "number") {
      response.status(400).json({ error: "duration and capacity must be numbers" });
      return;
    }

    const result = this.tokenManagerService.addRule(duration, capacity);
    if (result === AddRuleStatus.FAILED) {
      response.status(400).json({ status: "FAILED" });
      return;
    }

    response.status(result === AddRuleStatus.ADDED ? 201 : 200).json({
      status: result === AddRuleStatus.ADDED ? "ADDED" : "MODIFIED",
    });
  }

  private deleteRule(request: Request, response: Response): void {
    const duration = Number(request.params.duration);
    if (!Number.isFinite(duration) || duration <= 0) {
      response.status(400).json({ error: "duration must be a positive number" });
      return;
    }

    const result = this.tokenManagerService.deleteRule(duration);
    if (result === DeleteRuleStatus.NOT_FOUND) {
      response.status(404).json({ status: "NOT_FOUND" });
      return;
    }

    response.status(result === DeleteRuleStatus.DELETED ? 200 : 400).json({
      status: result === DeleteRuleStatus.DELETED ? "DELETED" : "FAILED",
    });
  }
}
