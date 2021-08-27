import { NotesProjectDataSource } from "../graphql/dataSources";

export type numberBoolean = boolean | number | undefined;
/**
 * Class for mocking 'NotesProjectDataSource' database ('DB' property).
 */
export default class MockNPDataSource {
  dataSource: NotesProjectDataSource | undefined;

  constructor(dataSource: NotesProjectDataSource) {
    this.dataSource = dataSource;
  }

  async populateTable(
    doUser: numberBoolean,
    doNote?: numberBoolean,
    doCategory?: numberBoolean,
    doNoteCategory?: numberBoolean
  ): Promise<void> {
    if (doUser) {
      // Insert user
      const insertUserQuery = "INSERT INTO user (id, name) VALUES(?, ?)";
      const userValues = [1, "Ruben"];
      await this.dataSource?.DB?.execute(insertUserQuery, userValues);
    }

    if (doNote) {
      // Insert note
      const insertNoteQuery =
        "INSERT INTO note (id, user, title) VALUES (?, ?, ?)";
      const noteValues = [1, 1, "Corazon"];
      await this.dataSource?.DB?.execute(insertNoteQuery, noteValues);
    }
    if (doCategory) {
      // Insert category
      const insertCategoryQuery =
        // "INSERT INTO category (id, user, label) VALUES (?, ?, ?), (?, ?, ?)";
        "INSERT INTO category (id, user, label) VALUES (?, ?, ?)";
      // const categoryValues = [1, 1, "Personal", 2, 1, "Trabajo"];
      const categoryValues = [1, 1, "Personal"];
      await this.dataSource?.DB?.execute(insertCategoryQuery, categoryValues);
    }
    if (doNoteCategory) {
      // Establish realationship
      const insertNoteCategoryQuery =
        // "INSERT INTO note_category (note, category) VALUES (?, ?), (?, ?)";
        "INSERT INTO note_category (note, category) VALUES (?, ?)";
      // const noteCategoryValues = [1, 1, 1, 2];
      const noteCategoryValues = [1, 1];
      await this.dataSource?.DB?.execute(
        insertNoteCategoryQuery,
        noteCategoryValues
      );
    }
  }

  async depopulateTable(
    doUser: numberBoolean,
    doNote?: numberBoolean,
    doCategory?: numberBoolean,
    doNoteCategory?: numberBoolean
  ): Promise<void> {
    if (doUser) {
      const removeQuery = "DELETE FROM user";
      await this.dataSource?.DB?.execute(removeQuery);
    }
    if (doNote) {
      const removeNoteQuery = "DELETE FROM note";
      await this.dataSource?.DB?.execute(removeNoteQuery);
    }
    if (doCategory) {
      const removeCategoryQuery = "DELETE FROM category";
      await this.dataSource?.DB?.execute(removeCategoryQuery);
    }
    if (doNoteCategory) {
      const removeNoteCategoryQuery = "DELETE FROM note_category";
      await this.dataSource?.DB?.execute(removeNoteCategoryQuery);
    }
  }
}
