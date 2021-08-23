import { expect } from "chai";
import { NotesProjectDataSource } from "../graphql/dataSources";
import { connectDB, connection } from "../config/database";

let dataSource: any | undefined;
const connectionConfig = {
  database: "notes_project_test",
  namedPlaceholders: true,
};

describe("Methods", () => {
  before(async () => {
    await connectDB(connectionConfig);
    dataSource = new NotesProjectDataSource();
  });

  after(async () => {
    await dataSource?.DB.end();
  });

  type numberBoolean = boolean | number | undefined;

  async function populateTable(
    doUser: numberBoolean,
    doNote?: numberBoolean,
    doCategory?: numberBoolean,
    doNoteCategory?: numberBoolean
  ): Promise<void> {
    if (doUser) {
      // Insert user
      const insertUserQuery = "INSERT INTO user (id, name) VALUES(?, ?)";
      const userValues = [1, "Ruben"];
      await dataSource?.DB.execute(insertUserQuery, userValues);
    }

    if (doNote) {
      // Insert note
      const insertNoteQuery =
        "INSERT INTO note (id, user, title) VALUES (?, ?, ?)";
      const noteValues = [1, 1, "Corazon"];
      await dataSource?.DB.execute(insertNoteQuery, noteValues);
    }
    if (doCategory) {
      // Insert category
      const insertCategoryQuery =
        "INSERT INTO category (id, user, label) VALUES (?, ?, ?), (?, ?, ?)";
      const categoryValues = [1, 1, "Personal", 2, 1, "Trabajo"];
      await dataSource?.DB.execute(insertCategoryQuery, categoryValues);
    }
    if (doNoteCategory) {
      // Establish realationship
      const insertNoteCategoryQuery =
        "INSERT INTO note_category (note, category) VALUES (?, ?), (?, ?)";
      const noteCategoryValues = [1, 1, 1, 2];
      await dataSource?.DB.execute(insertNoteCategoryQuery, noteCategoryValues);
    }
  }

  async function depopulateTable(
    doUser: numberBoolean,
    doNote?: numberBoolean,
    doCategory?: numberBoolean,
    doNoteCategory?: numberBoolean
  ): Promise<void> {
    if (doUser) {
      const removeQuery = "DELETE FROM user";
      await dataSource?.DB.execute(removeQuery);
    }
    if (doNote) {
      const removeNoteQuery = "DELETE FROM note";
      await dataSource?.DB.execute(removeNoteQuery);
    }
    if (doCategory) {
      const removeCategoryQuery = "DELETE FROM category";
      await dataSource?.DB.execute(removeCategoryQuery);
    }
    if (doNoteCategory) {
      const removeNoteCategoryQuery = "DELETE FROM note_category";
      await dataSource?.DB.execute(removeNoteCategoryQuery);
    }
  }

  describe("getUser", () => {
    beforeEach(async () => {
      // Populate table
      await populateTable(1);
    });

    afterEach(async () => {
      // Depopulate table
      await depopulateTable(1);
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
      await populateTable(1, 1);
    });

    afterEach(async () => {
      // Depopulate table
      await depopulateTable(1, 1);
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
      await populateTable(1, 1, 1);
    });

    afterEach(async () => {
      // Depopulate table
      await depopulateTable(1, 1, 1);
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
      await populateTable(1, 1, 1, 1);
    });

    afterEach(async () => {
      // Depopulate table
      await depopulateTable(1, 1, 1, 1);
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
      await populateTable(1, 1);
    });

    afterEach(async () => {
      // Depopulate table
      await depopulateTable(1, 1);
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
