import Query, {
  ResolverContext,
  ResolverParent,
} from "../../../graphql/resolvers";
import { expect } from "chai";
import { MockDataSource } from "../../../utils/";

const QueryResolvers = Query.Query;
const mockDataSource = new MockDataSource();
const MockApolloResolver = (
  resolver: (arg0: ResolverParent, arg1: any, arg2: ResolverContext) => any,
  params: Record<string, string>
) => {
  return resolver({}, params, {
    dataSources: { notesProject: mockDataSource },
  });
};

describe("Query resolvers", () => {
  describe("getUser", () => {
    it("With id = 1, should return an object matching IUser interface", async () => {
      // arrange
      const id = "1";
      const params = { id };
      // act
      const user = await MockApolloResolver(QueryResolvers.getUser, params);
      // assert
      expect(user).to.have.all.keys(["id", "google_id", "email", "name"]);
    });
  });
  describe("getUserNotes", () => {
    it("With userId = 1, should return an array matching INote interface", async () => {
      // arrange
      const userId = "1";
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
  describe("getUserCategories", () => {
    it("With userId = 1, should return an array matching ICategory interface", async () => {
      // arrange
      const userId = "1";
      const params = { userId };
      // act
      const categories = await MockApolloResolver(
        QueryResolvers.getUserCategories,
        params
      );
      // assert
      expect(categories[0]).to.have.all.keys(["id", "user", "label", "color"]);
    });
  });
  describe("getUserNotesPreview", () => {
    it("With userId = 1, should return an array partially matching INote with an extra prop categories that matches ICategory[]", async () => {
      // arrange
      const userId = "1";
      const params = { userId };
      // act
      const categories = await MockApolloResolver(
        QueryResolvers.getUserNotesPreview,
        params
      );
      // assert
      expect(categories[0]).to.have.all.keys(["id", "title", "categories"]);
      expect(categories[0].categories[0]).to.have.all.keys([
        "id",
        "user",
        "label",
        "color",
      ]);
    });
  });
  describe("getNoteBody", () => {
    it("With noteId = 1, should return a string", async () => {
      // arrange
      const noteId = "1";
      const params = { noteId };
      // act
      const noteBody = await MockApolloResolver(
        QueryResolvers.getNoteBody,
        params
      );
      // assert
      expect(noteBody).to.be.a("string");
    });
  });
});
