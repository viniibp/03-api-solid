import { it, describe, expect } from "vitest";
import { compare } from "bcryptjs";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { RegisterService } from "./register";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register service", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to create a user with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerService = new RegisterService(usersRepository);

    const email = "johndoe@example.com";

    await registerService.execute({
      name: "john doe",
      email,
      password: "123456",
    });

    await expect(() =>
      registerService.execute({
        name: "farofinha 123",
        email,
        password: "0987653123",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
