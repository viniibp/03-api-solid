import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCheckInService } from "@/services/factories/make-check-in-service";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 190;
    }),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const { gymId } = createCheckInParamsSchema.parse(request.params);

  const CheckInService = makeCheckInService();

  await CheckInService.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
