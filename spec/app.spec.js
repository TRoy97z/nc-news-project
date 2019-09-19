process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET: 200, responds with topics objects", () => {
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
        .then(({ body }) => {
          expect(body.user).to.be.an("array");
          expect(body.user[0]).to.contain.keys([
            "username",
            "avatar_url",
            "name"
          ]);
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET: 200, responds with an article object with all specified properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("array");
          expect(body.article[0]).to.contain.keys([
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          ]);
        });
    });
    it("PATCH: 202, updates votes property in specified article and responds with said article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 2 })
        .expect(202)
        .then(({ body }) => {
          expect(body.articles[0].article_id).to.equal(1);
          expect(body.articles[0].votes).to.equal(102);
        });
    });
  });
});
