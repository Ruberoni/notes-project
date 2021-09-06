import { expect } from "chai";
import { NotesProjectDataSource } from "../graphql/dataSources";
import { connectDB } from "../config/database";
import { MockNPDataSource } from "../utils/";

let dataSource: any | undefined;
let mockDataSource: any;

describe("NotesProjectDataSource", () => {
  describe("Methods", () => {
    before(async () => {
      await connectDB();
      dataSource = new NotesProjectDataSource();
      mockDataSource = new MockNPDataSource(dataSource);
      // Remove all rows of all tables
      await mockDataSource.depopulateTable(1, 1, 1, 1);
    });

    after(async () => {
      await mockDataSource.depopulateTable(1, 1, 1, 1);
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
        expect(notes[0]).to.have.property("title").that.is.an("string");
        expect(notes[0]).to.not.have.property("body"); /*.that.is.an('object')*/
        expect(notes[0]).to.have.property("categories").that.is.an("array").to
          .not.be.empty;
        expect(notes[0].categories[0])
          .to.have.property("label")
          .that.is.an("string");
        // expect(notes[0].categories[1]).to.have.property("label", "Trabajo");
      });
      it("Calling with a invalid userId, should return an empty array.", async () => {
        // arrange
        const userId = "hola";
        // act
        const notes = await dataSource.getUserNotesPreview(userId);
        // assert
        expect(notes).to.be.empty;
      });
      it("Calling with an user that don't have notes WITH categories, the 'categories' prop. should be empty", async () => {
        // arrange
        // create user
        const UserContent = {
          id: "2",
          name: "John Doe",
        };
        await dataSource.register(UserContent);
        // add note to user
        const userId = UserContent.id;
        const NoteContent = {
          title: "John Doe's Note",
        };
        await dataSource.createNote(userId, NoteContent);
        // act
        const notePreview = (await dataSource.getUserNotesPreview(userId))[0];
        // assert
        expect(notePreview.categories).to.be.empty;
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
    describe("register", () => {
      afterEach(async () => {
        await mockDataSource.depopulateTable(1);
      });
      it("Calling with good 'id', 'google_id', 'name', 'email' properties, should be a new user in the database.", async () => {
        // arrange
        const UserContent = {
          id: "2",
          googleId: "DEFAULT",
          name: "John Doe",
          email: "JohnDoe@gmail.com",
        };
        // act
        // register
        await dataSource.register(UserContent);
        // retrieve created user
        const user = await dataSource.getUser(UserContent.id);
        // assert
        expect(user).to.have.property("id", +UserContent.id);
        // expect(user).to.have.property("google_id", "");
        expect(user).to.have.property("name", UserContent.name);
        expect(user).to.have.property("email", UserContent.email);
      });
    });
    describe("deleteUser", () => {
      beforeEach(async () => {
        // Populate table
        await mockDataSource.populateTable(1);
      });
      it("Calling with good 'id', should be ok.", async () => {
        // arrange
        const id = 1;
        // act
        const res = await dataSource.deleteUser(id);

        expect(res).to.be.an("string");
      });
    });
    describe("updateUser", () => {
      beforeEach(async () => {
        // Populate table
        await mockDataSource.populateTable(1);
      });
      afterEach(async () => {
        // Populate table
        await mockDataSource.depopulateTable(1);
      });
      it("Calling with good 'id', 'name', 'email', should be ok", async () => {
        // arrange
        const id = 1;
        const UserContent = {
          name: "John Doe",
          email: "JohnDoe@gmail.com",
        };
        // act
        const res = await dataSource.updateUser(id, UserContent);
        // assert
        expect(res).to.be.an("string");
      });
    });
    describe("createNote", () => {
      beforeEach(async () => {
        await mockDataSource.populateTable(1);
      });
      afterEach(async () => {
        await mockDataSource.depopulateTable(1, 1);
      });
      it("Calling with good 'userId', 'id', 'title' and 'body' props, should be a new note in the database.", async () => {
        // arrange
        const userId = 1;
        const NoteContent = {
          id: "1",
          title: "SAMPLE",
          body: "Lorem Impsu",
        };
        // act
        // register
        await dataSource.createNote(userId, NoteContent);
        // retrieve created note
        const note = (await dataSource.getUserNotes(userId))[0];
        // assert
        expect(note).to.have.property("id", +NoteContent.id);
        expect(note).to.have.property("user", +userId);
        expect(note).to.have.property("title", NoteContent.title);
        expect(note).to.have.property("body", NoteContent.body);
      });
    });
    describe("updateNote", () => {
      beforeEach(async () => {
        // Populate table
        await mockDataSource.populateTable(1, 1);
      });
      afterEach(async () => {
        // Populate table
        await mockDataSource.depopulateTable(1, 1);
      });
      it("Calling with good 'id', 'title' and 'body', should be ok", async () => {
        // arrange
        const id = 1;
        const NoteContent = {
          title: "UPDATED SAMPLE",
          body: "Test",
        };
        // act
        const res = await dataSource.updateNote(id, NoteContent);
        // assert
        expect(res).to.be.an("string");
      });
    });
    describe("deleteNote", () => {
      beforeEach(async () => {
        // Populate table
        await mockDataSource.populateTable(1, 1);
      });
      afterEach(async () => {
        await mockDataSource.depopulateTable(1);
      });
      it("Calling with good 'id', should be ok.", async () => {
        // arrange
        const id = 1;
        // act
        const res = await dataSource.deleteNote(id);

        expect(res).to.be.an("string");
      });
    });
    describe("createCategory", () => {
      beforeEach(async () => {
        await mockDataSource.populateTable(1);
      });
      afterEach(async () => {
        await mockDataSource.depopulateTable(1, 0, 1);
      });
      it("Calling with good 'userId', 'id', 'label' and 'color' props, should be a new category in the database.", async () => {
        // arrange
        const userId = 1;
        const CategoryContent = {
          id: "1",
          label: "PERSONAL",
          color: "RED",
        };
        // act
        // register
        await dataSource.createCategory(userId, CategoryContent);
        // retrieve created category
        const category = (await dataSource.getUserCategories(userId))[0];
        // assert
        expect(category).to.have.property("id", +CategoryContent.id);
        expect(category).to.have.property("user", +userId);
        expect(category).to.have.property("label", CategoryContent.label);
        expect(category).to.have.property("color", CategoryContent.color);
      });
    });
    describe("updateCategory", () => {
      beforeEach(async () => {
        // Populate table
        await mockDataSource.populateTable(1, 0, 1);
      });
      afterEach(async () => {
        // Populate table
        await mockDataSource.depopulateTable(1, 0, 1);
      });
      it("Calling with good 'id', 'label' and 'color', should be ok", async () => {
        // arrange
        const id = 1;
        const CategoryContent = {
          label: "UPDATED PERSONAL",
          color: "BLUE",
        };
        // act
        const res = await dataSource.updateCategory(id, CategoryContent);
        // assert
        expect(res).to.be.an("string");
      });
    });
    describe("deleteCategory", () => {
      beforeEach(async () => {
        // Populate table
        await mockDataSource.populateTable(1, 0, 1);
      });
      afterEach(async () => {
        await mockDataSource.depopulateTable(1);
      });
      it("Calling with good 'id', should be ok.", async () => {
        // arrange
        const id = 1;
        // act
        const res = await dataSource.deleteCategory(id);

        expect(res).to.be.an("string");
      });
    });
    describe("addCategoryNote", () => {
      beforeEach(async () => {
        await mockDataSource.populateTable(1, 1, 1);
      });
      afterEach(async () => {
        await mockDataSource.depopulateTable(1, 1, 1, 1);
      });
      it("Calling with good 'categoryId' and 'noteId', should be a the new row in database' note_category table .", async () => {
        // arrange
        const categoryId = 1;
        const noteId = 1;
        const userId = 1;
        // act
        // register
        await dataSource.addCategoryNote(categoryId, noteId);
        // retrieve created note_category
        const notePreview = (await dataSource.getUserNotesPreview(userId))[0];
        // assert
        expect(notePreview.categories).to.not.be.empty;
        expect(notePreview.categories[0]).to.have.property("id", categoryId);
      });
    });
    describe("deleteCategoryNote", () => {
      beforeEach(async () => {
        // Populate table
        await mockDataSource.populateTable(1, 1, 1, 1);
      });
      afterEach(async () => {
        await mockDataSource.depopulateTable(1, 1, 1);
      });
      it("Calling with good 'categoryId' and 'noteId', should be ok.", async () => {
        // arrange
        const categoryId = 1;
        const noteId = 1;
        const userId = 1;

        // act
        await dataSource.deleteCategoryNote(categoryId, noteId);
        // check category_note has been deleted
        const notePreview = (await dataSource.getUserNotesPreview(userId))[0];

        // assert
        expect(notePreview.categories).to.be.empty;
      });
    });
  });
});
