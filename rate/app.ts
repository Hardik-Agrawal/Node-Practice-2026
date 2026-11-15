import express from "express";
import { RateLimiterController } from "./controller/impl/RateLimiterController.js";
import { TokenManagerController } from "./controller/impl/TokenManagerController.js";
import { BucketTokenManager } from "./repo/impl/BucketTokenManager.js";
import { DefaultRateLimiterService } from "./service/impl/DefaultRateLimiterService.js";
import { DefaultTokenManagerService } from "./service/impl/DefaultTokenManagerService.js";

const tokenManager = new BucketTokenManager();
tokenManager.addRule(
  Number(process.env.RATE_LIMIT_DURATION_MS ?? 60_000),
  Number(process.env.RATE_LIMIT_CAPACITY ?? 10),
);
const rateLimiterService = new DefaultRateLimiterService(tokenManager);
const rateLimiterController = new RateLimiterController(rateLimiterService);

const port = Number(process.env.PORT ?? 3000);
const app = express();
app.use(express.json());
app.use(rateLimiterController.router());

app.listen(port, () => {
  console.log(`Rate limiter listening on port ${port}`);
});
