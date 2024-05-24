import { it, describe, expect, beforeEach, vi, afterEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CheckInService } from "./check-in";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe("Check-In Service", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym-01",
      title: "Dart Gym",
      description: "",
      phone: "",
      latitude: -27.0747279,
      longitude: -49.4889672,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    });

    await expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -27.0747279,
        userLongitude: -49.4889672,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    });

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

    await expect(
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -27.0747279,
        userLongitude: -49.4889672,
      })
    ).resolves.toBeTruthy();
  });

  it("should not be able to check in on distance gym", async () => {
    await gymsRepository.create({
      id: "gym-02",
      title: "Teste Gym",
      description: "",
      phone: "",
      latitude: -27.0747279,
      longitude: -49.4889672,
    });

    await expect(
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
