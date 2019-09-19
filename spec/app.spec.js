process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET: 200, responds with topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).to.be.an("array");
          topics.every(topic => {
            expect(topic).to.contain.keys("slug", "description");
          });
        });
    });
  });
  describe("/users/:username", () => {
    it("GET: 200, responds with user object when given a valid username", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.be.an("array");
          expect(user[0]).to.contain.keys(["username", "avatar_url", "name"]);
        });
    });
  });
});
