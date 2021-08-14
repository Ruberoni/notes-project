// import "../schema"
import { apolloServer } from "../config/server";
import { expect } from "chai";

describe("Testing GraphQL schema using apolloServer.executeOperation()", () => {
  it("Request Query.numberOne should return 1", async () => {
    // arrange
    const query = "{ numberOne }";
    // act
    const result = await apolloServer.executeOperation({
      query,
    });
    // assert
    expect(result.errors).to.be.undefined;
    expect(result.data?.numberOne).to.equal(1);
  });
});
