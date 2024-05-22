import { it, describe, expect, beforeEach } from "vitest";
import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileService } from "./get-user-profile";
import { ResouceNotFoundError } from "./errors/resource-not-found";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get user profile service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    // sut é para nomear a principal variavel a ser testada (System Under Test)
    sut = new GetUserProfileService(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({ userId: createdUser.id });

    expect(user.name).toEqual("John Doe");
  });

  it("should not be able to get user profile", async () => {
    await expect(() =>
      sut.execute({ userId: "non-existing-id" })
    ).rejects.toBeInstanceOf(ResouceNotFoundError);
  });
});
