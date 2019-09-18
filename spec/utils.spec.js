const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    const input = [];
    const actual = formatDates(input);
    const expected = [];
    expect(actual).to.deep.equal(expected);
  });
  it("returns an array of a single object with the converted date", () => {
    const input = [
      {
        created_at: 1542284514171
      }
    ];
    const actual = formatDates(input);
    const expected = [{ created_at: new Date(1542284514171) }];
    expect(actual).to.deep.equal(expected);
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        created_at: 1542284514171
      }
    ];
    formatDates(input);
    expect(input).to.deep.equal([
      {
        created_at: 1542284514171
      }
    ]);
    expect(input).to.not.equal([
      {
        created_at: 1542284514171
      }
    ]);
  });
  it("return an array of objects with their date converted to the correct format", () => {
    const input = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        body: "I find this existence challenging",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge",
        created_at: 1542284514171
      },
      {
        article_id: 4,
        title: "Student SUES Mitch!",
        body: "cure to cancer",
        votes: 0,
        topic: "mitch",
        author: "rogersop",
        created_at: 1289996514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        body: "I find this existence challenging",
        votes: 0,
        topic: "mitch",
        author: "butter_bridge",
        created_at: new Date(1542284514171)
      },
      {
        article_id: 4,
        title: "Student SUES Mitch!",
        body: "cure to cancer",
        votes: 0,
        topic: "mitch",
        author: "rogersop",
        created_at: new Date(1289996514171)
      }
    ];
    expect(actual).to.deep.equal(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it("returns an reference object with a key of title with the value of article id, when given an array containing a relevant object", () => {
    const input = [
      {
        article_id: 6,
        title: "A"
      }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { A: 6 };
    expect(actual).to.deep.equal(expected);
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        article_id: 6,
        title: "A"
      }
    ];
    makeRefObj(input);
    expect(input).to.deep.equal([
      {
        article_id: 6,
        title: "A"
      }
    ]);
    expect(input).to.not.equal([
      {
        article_id: 6,
        title: "A"
      }
    ]);
  });
  it("returns reference object with a key of title with the value of article id when passed an array containing multiple relevant object", () => {
    const input = [
      {
        article_id: 6,
        title: "A"
      },
      { article_id: 7, title: "Z" },
      { article_id: 12, title: "Moustache" }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { A: 6, Moustache: 12, Z: 7 };
    expect(actual).to.deep.equal(expected);
  });
});

describe("formatComments", () => {
  it("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it("returns an object with the 'belongs_to' key changed to an 'article_id' key and the value changed, the name of the 'created_by' key changed to 'author", () => {
    const input = [
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge"
      }
    ];
    const referenceInput = { "Living in the shadow of a great man": 1 };
    const actual = formatComments(input, referenceInput);
    const expected = [{ article_id: 1, author: "butter_bridge" }];
    expect(actual).to.deep.equal(expected);
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge"
      }
    ];
    makeRefObj(input, { "Living in the shadow of a great man": 1 });
    expect(input).to.deep.equal([
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge"
      }
    ]);
    expect(input).to.not.equal([
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge"
      }
    ]);
  });
  it("returns multiple objects with the 'belongs_to' key changed to an 'article_id' key and the value changed, the name of the 'created_by' key changed to 'author", () => {
    const input = [
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge"
      },
      {
        belongs_to: "Sony Vaio; or, The Laptop",
        created_by: "icellusedkars"
      }
    ];
    const referenceInput = {
      "Living in the shadow of a great man": 1,
      "Sony Vaio; or, The Laptop": 2
    };
    const actual = formatComments(input, referenceInput);
    const expected = [
      { article_id: 1, author: "butter_bridge" },
      { article_id: 2, author: "icellusedkars" }
    ];
    expect(actual).to.deep.equal(expected);
  });
});
