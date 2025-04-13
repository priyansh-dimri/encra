const request = require("supertest");
const app = require("../server");

describe("GET /health", () => {
  it("responds with healthy status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "healthy" });
  });
});
