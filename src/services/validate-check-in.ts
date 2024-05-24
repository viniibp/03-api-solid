import dayjs from "dayjs";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResouceNotFoundError } from "./errors/resource-not-found";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

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

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes"
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
