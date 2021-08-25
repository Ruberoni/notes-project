import { expect } from "chai";
import { NotesProjectDataSource } from "../graphql/dataSources";
import { connectDB, connection } from "../config/database";
import { MockNPDataSource } from "../utils/";

let dataSource: any | undefined;
let mockDataSource: any;

/*const connectionConfig = {
  database: "notes_project_test",
  namedPlaceholders: true,
};*/

describe("Methods", () => {
  before(async () => {
    await connectDB();
    dataSource = new NotesProjectDataSource();
    mockDataSource = new MockNPDataSource(dataSource);
  });

  after(async () => {
    await dataSource?.DB.end();
  });

  describe("getUser", () => {
    beforeEach(async () => {
      // Populate table
      await mockDataSource.populateTable(1);
    });

    afterEach(async () => {
      // Depopulate table
      await mockDataSource.depopulateTable(1);
    });

    it("Calling getUser(1), should return an user", async () => {
      // arrange
      const id = "1";
      // act
      const user = await dataSource?.getUser(id);

      // assert
      expect(user).to.have.property("name", "Ruben");
    });

    it("Calling getUser(0), should return undefined", async () => {
      // arrange
      const id = "0";
      // act
      const user = await dataSource?.getUser(id);

      // assert
      expect(user).to.be.undefined;
    });

    it("Calling getUser('hola'), should return undefined", async () => {
      // arrange
      const id = "hola";
      // act
      const user = await dataSource?.getUser(id);

      // assert
      expect(user).to.be.undefined;
    });
  });

  describe("getUserNotes", () => {
    beforeEach(async () => {
      // Populate table
      await mockDataSource.populateTable(1, 1);
    });

    afterEach(async () => {
      // Depopulate table
      await mockDataSource.depopulateTable(1, 1);
    });

    it("Calling with a valid userId, should return an array of object with title prop.", async () => {
      // arrange
      const userId = "1";
      // act
      const notes = await dataSource.getUserNotes(userId);
      // assert
      // expect(notes).to.be.an("array");
      expect(notes[0]).to.have.property("title", "Corazon");
    });
    it("Calling with a invalid userId, should return an empty array.", async () => {
      // arrange
      const userId = "hola";
      // act
      const notes = await dataSource.getUserNotes(userId);
      // assert
      // expect(notes).to.be.an("array");
      expect(notes).to.be.empty;
    });
  });
  describe("getUserCategories", () => {
    beforeEach(async () => {
      // Populate table
      await mockDataSource.populateTable(1, 1, 1);
    });

    afterEach(async () => {
      // Depopulate table
      await mockDataSource.depopulateTable(1, 1, 1);
    });

    it("Calling with a valid userId, should return an array of object with label prop.", async () => {
      // arrange
      const userId = "1";
      // act
      const categories = await dataSource.getUserCategories(userId);
      // assert
      expect(categories[0]).to.have.property("label", "Personal");
    });
    it("Calling with a invalid userId, should return an empty array.", async () => {
      // arrange
      const userId = "hola";
      // act
      const categories = await dataSource.getUserCategories(userId);
      // assert
      expect(categories).to.be.empty;
    });
  });

  describe("getUserNotesPreview", () => {
    beforeEach(async () => {
      // Populate table
      await mockDataSource.populateTable(1, 1, 1, 1);
    });

    afterEach(async () => {
      // Depopulate table
      await mockDataSource.depopulateTable(1, 1, 1, 1);
    });

    it("Calling with a valid userId, should return an array of note where each have a categories array", async () => {
      // arrange
      const userId = "1";
      // act
      const notes = await dataSource.getUserNotesPreview(userId);
      // assert
      expect(notes[0]).to.have.property("title", "Corazon");
      expect(notes[0]).to.not.have.property("body");
      expect(notes[0]).to.have.property("categories");
      expect(notes[0].categories[0]).to.have.property("label", "Personal");
      expect(notes[0].categories[1]).to.have.property("label", "Trabajo");
    });
    it("Calling with a invalid userId, should return an empty array.", async () => {
      // arrange
      const userId = "hola";
      // act
      const notes = await dataSource.getUserNotesPreview(userId);
      // assert
      expect(notes).to.be.empty;
    });
  });

  describe("getNoteBody", () => {
    beforeEach(async () => {
      // Populate table
      await mockDataSource.populateTable(1, 1);
    });

    afterEach(async () => {
      // Depopulate table
      await mockDataSource.depopulateTable(1, 1);
    });

    it("Calling with a valid noteId, should return a string", async () => {
      // arrange
      const noteId = 1;
      // act
      const noteBody = await dataSource.getNoteBody(noteId);
      // assert
      expect(noteBody).to.be.an("string");
    });
  });
});
