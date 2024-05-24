import { it, describe, expect, beforeEach } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsService } from "./search-gyms";

let gymRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe("Search Gyms Service", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(gymRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymRepository.create({
      title: "Dart Gym",
      description: null,
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672,
    });

    await gymRepository.create({
      title: "JS Gym",
      description: null,
      phone: null,
      latitude: -27.0747279,
      longitude: -49.4889672,
    });

    const { gyms } = await sut.execute({
      query: "Dart",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Dart Gym" })]);
  });

  it("should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymRepository.create({
        title: `Dart Gym ${i}`,
        description: null,
        phone: null,
        latitude: -27.0747279,
        longitude: -49.4889672,
      });
    }

    const { gyms } = await sut.execute({
      query: "Dart",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Dart Gym 21" }),
      expect.objectContaining({ title: "Dart Gym 22" }),
    ]);
  });
});
