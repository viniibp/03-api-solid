import { GymsRepository } from "@/repositories/gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

interface CreateGymRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymResponse {
  gym: {
    id: string;
    title: string;
    description: string | null;
    phone: string | null;
    latitude: Decimal;
    longitude: Decimal;
  };
}

export class CreateGymService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymRequest): Promise<CreateGymResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
