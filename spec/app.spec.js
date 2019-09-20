process.env.NODE_ENV = "test";
const connection = require("../db/connection");
const request = require("supertest");
const { expect } = require("chai");
const app = require("../app");
const chai = require("chai");
chai.use(require("chai-sorted"));

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
    it("PATCH: 202, updates votes property in specified article by adding 2 votes and responds with said article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 2 })
        .expect(202)
        .then(({ body }) => {
          expect(body.article[0].article_id).to.equal(1);
          expect(body.article[0].votes).to.equal(102);
        });
    });
    it("PATCH: 202, decreases votes property by 5", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -5 })
        .expect(202)
        .then(({ body }) => {
          expect(body.article[0].article_id).to.equal(1);
          expect(body.article[0].votes).to.equal(95);
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("POST: 201, adds new comment to specified article ", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "I forget what i was reading"
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).to.contain.keys([
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          ]);
        });
    });
    it("GET: 200, responds with comments of an article specified by article id ", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.an("array");
          expect(body.comments[0]).to.contain.keys([
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          ]);
        });
    });
    // it("status 200: respond with comments sorted by created_at by default", () => {
    //   return request(app)
    //     .get("/api/articles/1/comments")
    //     .expect(200)
    //     .then(({ body }) => {
    //       console.log(body);
    //       expect(body).to.be.sortedBy("created_at");
    //     });
    // });
    // it("GET 200: respond with comments sorted by a query", () => {
    //   return request(app)
    //     .get("/api/articles/1/comments?sortBy=comment_id")
    //     .expect(200)
    //     .then(({ body }) => {
    //       const testComment = body.comments;
    //       formatComment = testComment.map(comment => {
    //         return { ...comment, comment_id: +comment.comment_id };
    //       });
    //       expect(body).to.be.sortedBy("comment_id");
    //     });
    // });
    it("GET 200: respond with comments ordered by a query", () => {
      return request(app)
        .get("/api/articles/1/comments?sortBy=comment_id&orderBy=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy("comment_id");
        });
    });
  });
});
