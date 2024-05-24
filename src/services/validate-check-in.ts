import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResouceNotFoundError } from "./errors/resource-not-found";

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

interface ValidateCheckInServiceResponse {
  checkIn: {
    id: string;
    created_at: Date;
    validated_at: Date | null;
    user_id: string;
    gym_id: string;
  };
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResouceNotFoundError();
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
