const { assert } = require("chai");
const {
  getUserByEmail,
  urlsForUser,
  validRandom
} = require("../helpers");

// describe("#getUserByEmail", () => {
//   it("does something", () => {

//   });
// });

const testUrlDatabase = {
  "b2xVn2": { "longURL": "http://www.lighthouselabs.ca", "userID": "userRandomID" },
  "9sm5xK": { "longURL": "http://www.google.com", "userID": "userRandomID" }
};

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dish"
  }
};

describe("getUserByEmail", () => {
  it("should return the user's id that matches a valid email", () => {
    const output = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.isTrue(output === expectedOutput);
  });
  it("should return undefined if given an invalid email (no associated account)", () => {
    const output = getUserByEmail("user@exampleeeeeee.com", testUsers);
    assert.isTrue(output === undefined);
  });
  it("should return undefined if given no email (empty string)", () => {
    const output = getUserByEmail("", testUsers);
    assert.isTrue(output === undefined);
  });
});

describe("urlsForUser", () => {
  it("Returns an array with all of a user's shortURLs", () => {
    const output = urlsForUser("userRandomID", testUrlDatabase);
    assert.isTrue(output[0] === "b2xVn2" && output[1] === "9sm5xK" && output.length === 2);
  });
  it("Returns an empty array if user has no shortURLs", () => {
    const output = urlsForUser("user2RandomID", testUrlDatabase);
    assert.isTrue(output.length === 0);
  });
});

describe("validRandom", () => {
  it("returns a 6-characters-long, randomized, alphanumeric string", () => {
    const output = validRandom(testUsers);
    assert.isTrue(output.length === 6 && typeof output === 'string');
  });
});