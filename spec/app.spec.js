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
    it("404: responds with an error message when trying to get a user with an username that does not exist", () => {
      return request(app)
        .get("/api/users/notAUser")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("User not found");
        });
    });
  });
  describe("/articles", () => {
    it("GET: 200, responds with all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0]).to.contain.keys(
            "author",
            "title",
            "article_id",
            "topic",
            "created_at",
            "votes",
            "comment_count"
          );
        });
    });
    it("GET:200, responds with articles sortedBy created_at and in descending order, when given a query", () => {
      return request(app)
        .get("/api/articles?order=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
        });
    });
    it("GET:200, responds with articles created by a specific author when given a query", () => {
      return request(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].author).to.equal("butter_bridge");
          expect(body.articles[1].author).to.equal("butter_bridge");
        });
    });
    it("GET:200, responds with article with specific topic, when given the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles[0].topic).to.equal("mitch");
          expect(body.articles[1].topic).to.equal("mitch");
        });
    });
    it("400: responds with Bad Request when theres an invalid order query", () => {
      return request(app)
        .get("/api/articles?order=invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("404: responds with Not Found when theres an invalid author or author does not exist", () => {
      return request(app)
        .get("/api/articles?author=invalid")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
    it("404: responds with Not Found when theres an invalid topic or author does not exist", () => {
      return request(app)
        .get("/api/articles?topic=invalid")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET: 200, responds with an article object with all specified properties with given article_id", () => {
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
    it("400: returns error 'Bad Request' when passed invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalidId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("404: returns error 'Input Does Not Exist' when passed valid article_id that doesnt exist", () => {
      return request(app)
        .get("/api/articles/76865")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Input Does Not Exist");
        });
    });
    it("PATCH: 200, updates votes property in specified article by adding 2 votes and responds with said article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 2 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article[0].article_id).to.equal(1);
          expect(body.article[0].votes).to.equal(102);
        });
    });
    it("PATCH: 200, decreases votes property by 5", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -5 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article[0].article_id).to.equal(1);
          expect(body.article[0].votes).to.equal(95);
        });
    });
    it("400: when passed invalid vote count returns 'Bad Request'", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "invalidVote" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("400: when passed invalid article_id returns 'Bad Request'", () => {
      return request(app)
        .patch("/api/articles/invalidId")
        .send({ inc_votes: 4 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("404: when passed article_id that is valid but does not exist returns 'Input Does Not Exist'", () => {
      return request(app)
        .patch("/api/articles/9990")
        .send({ inc_votes: 4 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Input Does Not Exist");
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
    it("400: when passed invalid article_id returns 'Bad Request'", () => {
      return request(app)
        .post("/api/articles/invalidId/comments")
        .send({
          username: "butter_bridge",
          body: "I forget what i was reading"
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("404: when passed article_id that is valid but does not exist returns 'Input Does Not Exist'", () => {
      return request(app)
        .patch("/api/articles/9990")
        .send({
          username: "butter_bridge",
          body: "I forget what i was reading"
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Input Does Not Exist");
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
    it("GET: 200 respond with comments sorted by created_at by default", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy("created_at");
        });
    });
    it("GET: 200 respond with comments sorted by a query", () => {
      return request(app)
        .get("/api/articles/1/comments?sortBy=comment_id")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.descendingBy("comment_id");
        });
    });
    it("GET: 200 respond with comments ordered by a query", () => {
      return request(app)
        .get("/api/articles/1/comments?sortBy=comment_id&orderBy=desc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy("comment_id");
        });
    });
  });
  describe("/comments/:comment_id", () => {
    it("PATCH:200 should update a comment's votes given the ID and respond with the updated comment (increasing votes)", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({
          inc_votes: 10
        })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.comment_id).to.equal(1);
          expect(comment.votes).to.equal(26);
        });
    });
    it("status:200 should update a comment's votes given the ID and respond with the updated comment (decreasing votes)", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({
          inc_votes: -1
        })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.comment_id).to.equal(1);
          expect(comment.votes).to.equal(15);
        });
    });
    it("status:404 responds with an error message when trying to update with an ID that does not exist", () => {
      return request(app)
        .patch("/api/comments/9999")
        .send({
          inc_votes: 10
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Comment not found");
        });
    });
    it("status:400 responds with an error message when trying to update with an ID that is not of the correct datatype", () => {
      return request(app)
        .patch("/api/comments/not-a-number")
        .send({
          inc_votes: 10
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
    it("DELETE: 204 removes the specified comment and returns the status code", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204);
    });
    it("404: responds with an error message when the comment ID does not exist", () => {
      return request(app)
        .delete("/api/comments/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Comment not found");
        });
    });
    it("400: responds with an error message when the comment ID is not of the correct datatype", () => {
      return request(app)
        .delete("/api/comments/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Request");
        });
    });
  });
});
