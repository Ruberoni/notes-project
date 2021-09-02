import "reflect-metadata";
import { Queries } from "../../../graphql/resolvers";
import { expect } from "chai";
import { NotesProjectDataSource } from "../../../graphql";
import Sinon, { SinonStub } from "sinon";

// const QueryResolvers = new Resolvers[0]();
const QueryResolvers = new Queries();
const DSInstance = new NotesProjectDataSource();
const MockApolloResolver = (
  resolver: (arg1: any, arg2: any) => any,
  params: Record<string, string>
) => {
  return resolver(params, {
    dataSources: { notesProject: DSInstance },
  });
};

function StubNotesProjectDataSource(method: any): SinonStub {
  return Sinon.stub(DSInstance, method);
}

describe("Query resolvers", () => {
  describe("Tests methods", () => {
    it("test. Should return an string", () => {
      // arrange
      // act
      const result = QueryResolvers.test();
      // assert
      expect(result).to.be.a("string");
    });
    it("asyncTest. Should return an string", async () => {
      const result = await QueryResolvers.asyncTest();
      expect(result).to.be.a("string");
    });
  });
  describe("getUser", () => {
    it("With id = 1, should return an object matching User interface", async () => {
      // arrange
      const id = "1";
      const params = { id };
      const getUserReturn = {
        id: "1",
        google_id: "sample",
        email: "JohnDoe@gmail.com",
        name: "John Doe",
      };
      StubNotesProjectDataSource("getUser").returns(getUserReturn);
      // act
      const user = await MockApolloResolver(QueryResolvers.getUser, params);
      // assert
      expect(user.id).to.be.an("string");
      expect(user.google_id).to.be.an("string");
      expect(user.email).to.be.an("string");
      expect(user.name).to.be.an("string");
    });
  });
  describe("getUserNotes", () => {
    it("With userId = 1, should return an array matching Note interface", async () => {
      // arrange
      const userId = "1";
      const params = { userId };
      const getUserNotesReturn = [
        {
          id: "1",
          user: "1",
          title: "Sample",
          body: "Lorem impsu",
        },
      ];
      StubNotesProjectDataSource("getUserNotes").returns(getUserNotesReturn);

      // act
      const notes = await MockApolloResolver(
        QueryResolvers.getUserNotes,
        params
      );
      // assert
      expect(notes[0].id).to.be.an("string");
      expect(notes[0].user).to.be.an("string");
      expect(notes[0].title).to.be.an("string");
      expect(notes[0].body).to.be.an("string");
    });
  });

  describe("getUserCategories", () => {
    it("With userId = 1, should return an array matching ICategory interface", async () => {
      // arrange
      const userId = "1";
      const params = { userId };
      const getUserCategoriesReturn = [
        {
          id: "1",
          user: "1",
          label: "Sample",
          color: "Red",
        },
      ];
      StubNotesProjectDataSource("getUserCategories").returns(
        getUserCategoriesReturn
      );

      // act
      const categories = await MockApolloResolver(
        QueryResolvers.getUserCategories,
        params
      );
      // assert
      expect(categories[0].id).to.be.an("string");
      expect(categories[0].user).to.be.an("string");
      expect(categories[0].label).to.be.an("string");
      expect(categories[0].color).to.be.an("string");
    });
  });
  describe("getUserNotesPreview", () => {
    it("With userId = 1, should return an array partially matching INote with an extra prop categories that matches ICategory[]", async () => {
      // arrange
      const userId = "1";
      const params = { userId };
      const getUserNotesPreviewReturn = [
        {
          id: "1",
          title: "Sample",
          categories: [
            {
              id: "1",
              user: "1",
              label: "Sample",
              color: "Red",
            },
          ],
        },
      ];
      StubNotesProjectDataSource("getUserNotesPreview").returns(
        getUserNotesPreviewReturn
      );

      // act
      const notePreviews = await MockApolloResolver(
        QueryResolvers.getUserNotesPreview,
        params
      );
      // assert
      expect(notePreviews[0].id).to.be.an("string");
      expect(notePreviews[0].title).to.be.an("string");
      expect(notePreviews[0].categories).to.be.an("array");
    });
  });
  describe("getNoteBody", () => {
    it("With noteId = 1, should return a string", async () => {
      // arrange
      const noteId = "1";
      const params = { noteId };
      const getNoteBodyReturn = "Lorem Impsu";
      StubNotesProjectDataSource("getNoteBody").returns(getNoteBodyReturn);

      // act
      const noteBody = await MockApolloResolver(
        QueryResolvers.getNoteBody,
        params
      );
      // assert
      expect(noteBody).to.be.an("string");
    });
  });
});
