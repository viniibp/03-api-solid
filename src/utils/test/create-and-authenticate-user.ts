import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false
) {
  const user = await prisma.user.create({
    data: {
      name: "User test",
      email: "test@example.com.br",
      password_hash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  await request(app.server).post("/users").send({
    name: "User test",
    email: "test@example.com.br",
    password: "123456",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "test@example.com.br",
    password: "123456",
  });

  const { token } = authResponse.body;

  return { token };
}
