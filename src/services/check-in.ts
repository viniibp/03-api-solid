import { UsersRepository } from "@/repositories/users-repository";
import { ResouceNotFoundError } from "./errors/resource-not-found";
import { CheckInsRepository } from "@/repositories/check-ins.repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface CheckInRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInResponse {
  checkIn: {
    id: string;
    created_at: Date;
    validated_at: Date | null;
    user_id: string;
    gym_id: string;
  };
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInRequest): Promise<CheckInResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResouceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}