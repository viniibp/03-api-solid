import { hash } from "bcryptjs";
import type { User } from "@prisma/client";

import { UsersRepository } from "@/repositories/users-repository.interface";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterServiceResponse {
  user: {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
  };
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return { user };
  }
}
