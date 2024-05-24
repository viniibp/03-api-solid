import { GymsRepository } from "@/repositories/gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

interface SearchGymsServiceRequest {
  query: string;
  page: number;
}

interface SearchGymsServiceResponse {
  gyms: {
    id: string;
    title: string;
    description: string | null;
    phone: string | null;
    latitude: Decimal;
    longitude: Decimal;
  }[];
}

export class SearchGymsService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsServiceRequest): Promise<SearchGymsServiceResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
