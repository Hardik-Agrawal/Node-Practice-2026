interface ForwardRequestResponse {
  allowed: boolean;
}

export class TokenManagerClient {
  private readonly serviceUrl: URL;

  constructor(serviceUrl = "http://localhost:8080") {
    this.serviceUrl = new URL(serviceUrl);
  }

  async canMessageBeForwarded(userId: string): Promise<boolean> {
    const url = new URL("/request", this.serviceUrl);
    url.searchParams.set("userId", userId);

    const response = await fetch(url);
    if (response.status !== 200 && response.status !== 429) {
      throw new Error(`TokenManager service returned HTTP ${response.status}`);
    }

    const result = (await response.json()) as ForwardRequestResponse;
    if (typeof result.allowed !== "boolean") {
      throw new Error("TokenManager service returned an invalid response");
    }

    return result.allowed;
  }
}
