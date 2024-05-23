import { UsersRepository } from "@/repositories/users-repository";
import { compare } from "bcryptjs";

import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  user: {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
  };
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user?.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }
    return { user };
  }
}
