// import { expect } from "chai";
import Resolvers from "./graphql/resolvers/";

// https://www.alxolr.com/articles/how-to-separate-mocha-tests-in-multiple-files
describe("Integration tests", () => {
  describe("Resolvers", Resolvers.bind(this));
});
