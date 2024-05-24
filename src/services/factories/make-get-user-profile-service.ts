import { GetUserProfileService } from "../get-user-profile";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeGetUserMetricsService() {
  const usersRepository = new PrismaUsersRepository();

  const service = new GetUserProfileService(usersRepository);

  return service;
}
