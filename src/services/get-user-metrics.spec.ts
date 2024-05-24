import { describe, it, beforeEach, expect } from "vitest";

import { GetUserMetricsService } from "./get-user-metrics";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: CheckInsRepository;
let sut: GetUserMetricsService;

describe("Get User Metrics Service", () => {
    
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsService(checkInsRepository);
  });

  it("should be possible to get check-ins count from metrics", async () => {
    await checkInsRepository.create({ gym_id: "gym-01", user_id: "user-01" });
    await checkInsRepository.create({ gym_id: "gym-02", user_id: "user-01" });

    const { checkInsCount } = await sut.execute({ userId: "user-01" });

    expect(checkInsCount).toEqual(2);
  });
});
