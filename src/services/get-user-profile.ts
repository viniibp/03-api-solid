import { UsersRepository } from "@/repositories/users-repository.interface";
import { ResouceNotFoundError } from "./errors/resource-not-found";

interface GetUserProfileServiceRequest {
  userId: string;
}

interface GetUserProfileServiceResponse {
  user: {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
  };
}

export class GetUserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResouceNotFoundError();
    }

    return { user };
  }
}
