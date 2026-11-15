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

const app = express();
app.use(express.json());
app.use(
  "/token-manager",
  new TokenManagerController(new DefaultTokenManagerService(tokenManager)).router(),
);

const port = Number(process.env.TOKEN_MANAGER_PORT ?? 8080);
app.listen(port, () => {
  console.log(`TokenManager service listening on port ${port}`);
});
