import Query from "../../../graphql/resolvers";
import { expect } from "chai";
import { MockDataSource } from "../../../utils/";

const QueryResolvers = Query.Query;
const mockDataSource = new MockDataSource();
const MockApolloResolver = (
  resolver: (arg0: any, arg1: any, arg2: any) => any,
  params: any
) => {
  return resolver(null, params, {
    dataSources: { notesProject: mockDataSource },
  });
};

describe("Query resolvers", () => {
  describe("getUser", () => {
    it("With id = 1, should return an object matching IUser interface", async () => {
      // arrange
      const id = 1;
      const params = { id };
      // act
      const user = await MockApolloResolver(QueryResolvers.getUser, params);
      // assert
      expect(user).to.have.all.keys(["id", "google_id", "email", "name"]);
    });
  });
  describe("getUserNotes", () => {
    it("With userId = 1, should return an object matching INote interface", async () => {
      // arrange
      const userId = 1;
      const params = { userId };
      // act
      const notes = await MockApolloResolver(
        QueryResolvers.getUserNotes,
        params
      );
      // assert
      expect(notes[0]).to.have.all.keys(["id", "user", "title", "body"]);
    });
  });
});
