import { expect } from "chai";

describe("Checking Chai & Mocha works fine", () => {
  it("Sum 2 + 3 should be 5", () => {
    // arrange
    const a = 2;
    const b = 3;

    // act
    const result = a + b;

    // assert
    expect(result).to.equal(5);
  });
});
