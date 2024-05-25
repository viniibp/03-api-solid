import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {

  const metricsCheckInService = makeGetUserMetricsService();

  const { checkInsCount } = await metricsCheckInService.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkInsCount });
}
