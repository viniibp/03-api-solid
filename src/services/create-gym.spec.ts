import { it, describe, expect, beforeEach } from "vitest";
import { CreateGymService } from "./create-gym";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe("Create Gym Service", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymRepository);
  });

  it("should be able to create a gym", async () => {
    const { gym } = await sut.execute({
      title: "Dart Gym",
      description: null,
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
