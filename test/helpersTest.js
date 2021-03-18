const { assert } = require("chai");
const { getUserByEmail } = require("../helpers");

// describe("#getUserByEmail", () => {
//   it("does something", () => {

//   });
// });

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