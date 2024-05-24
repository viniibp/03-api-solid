import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins.repository";

interface FetchUserCheckInHistoryServiceRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInHistoryServiceResponse {
  checkIns: {
    id: string;
    created_at: Date;
    validated_at: Date | null;
    user_id: string;
    gym_id: string;
  }[];
}

export class FetchUserCheckInHistoryService {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryServiceRequest): Promise<FetchUserCheckInHistoryServiceResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page
    );
    return { checkIns };
  }
}
