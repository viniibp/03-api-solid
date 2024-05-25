import { it, describe, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Dart Gym",
        description: "some descript",
        phone: "119999999",
        latitude: -27.0747279,
        longitude: -49.4889672,
      });

    expect(response.statusCode).toEqual(201);
  });
});
