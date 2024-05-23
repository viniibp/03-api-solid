import { it, describe, expect, beforeEach } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInService } from "./check-in";
import { ResouceNotFoundError } from "./errors/resource-not-found";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe("Check-In Service", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    // sut é para nomear a principal variavel a ser testada (System Under Test)
    sut = new CheckInService(checkInsRepository);
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

//   it("should not be able to get user profile", async () => {
//     await expect(() =>
//       sut.execute({ userId: "non-existing-id" })
//     ).rejects.toBeInstanceOf(ResouceNotFoundError);
//   });
});
