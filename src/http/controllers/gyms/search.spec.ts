import { it, describe, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Seach Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able search gyms by title", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Dart Gym",
        description: "some descript",
        phone: "119999999",
        latitude: -27.0747279,
        longitude: -49.4889672,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Java Gym",
        description: "some descript",
        phone: "119999999",
        latitude: -27.0747279,
        longitude: -49.4889672,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({ q: "Java" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: "Java Gym" }),
    ]);
  });
});
