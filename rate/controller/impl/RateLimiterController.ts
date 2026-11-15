import { Router, type Request, type Response } from "express";
import type { RateLimiterService } from "../../service/RateLimiterService.js";

export class RateLimiterController {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  router(): Router {
    const router = Router();
    router.get("/request", (request, response) => this.handleRequest(request, response));
    return router;
  }

  private handleRequest(request: Request, response: Response): void {
    console.log("RateLimiterController.handle called");
    const queryUserId = request.query.userId;
    const userId = (typeof queryUserId === "string" ? queryUserId : undefined)
      ?? request.header("x-user-id")
      ?? null;
    if(userId === null) {
      response.status(400).json({ error: "Missing userId" });
      return;
    }
    const allowed = this.rateLimiterService.forwardRequest(userId);

    response.status(allowed ? 200 : 429).json({ allowed });
  }
}
