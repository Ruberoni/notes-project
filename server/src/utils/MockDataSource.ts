import { Connection } from "mysql2/promise";
import {
  ICategoryContent,
  INoteContent,
  IUserContent,
  ID,
  IUser,
  INote,
  INotePreview,
  ICategory,
  NotesProjectDataSource,
} from "../graphql";

const users: { [key: string]: IUser } = {
  "1": {
    id: "1",
    google_id: "SAMPLE",
    email: "JohnDoe@gmail.com",
    name: "John Doe",
  },
};

const notes: { [key: string]: INote } = {
  "1": {
    id: "1",
    user: "1",
    title: "SAMPLE",
    body: "SAMPLE",
  },
};

const categories: { [key: string]: ICategory } = {
  "1": {
    id: "1",
    user: "1",
    label: "SAMPLE",
    color: "SAMPLE",
  },
};

export default class MockDataSource implements NotesProjectDataSource {
  readonly DB: Connection | undefined;
  async getUser(id: string): Promise<IUser> {
    const user = async () => users[id];
    return await user();
  }

  async getUserNotes(userId: string): Promise<INote[]> {
    // const _notes = async () => notes.filter((note: INote) => note.user === userId);
    const _notes = async () => [notes["1"]];
    return await _notes();
  }
  async getUserCategories(userId: string): Promise<ICategory[]> {
    // const _categories = async () =>
    //   categories.filter((category: ICategory) => category.user === userId);
    const _categories = async () => [categories["1"]];
    return await _categories();
  }
  /*
   * Retrieve all user notes with its categories but every note WILL NOT have its Body.
   */

  async getUserNotesPreview(userId: string): Promise<INotePreview[]> {
    const notesPreview = async () => [
      {
        id: notes["1"].id,
        title: notes["1"].title,
        categories: [categories["1"]],
      },
    ];
    return await notesPreview();
  }
  async getNoteBody(noteId: string): Promise<string> {
    const noteBody = async () => notes[noteId].body || "";
    return await noteBody();
  }
  async register(userContent: IUser): Promise<string> {
    return "OK";
  }
  async deleteUser(id: ID): Promise<string> {
    return "OK";
  }
  async updateUser(id: ID, UserContent: IUserContent): Promise<string> {
    return "OK";
  }
  async createNote(userId: ID, content: INote): Promise<string> {
    return "OK";
  }
  async updateNote(id: ID, content: INoteContent): Promise<string> {
    return "OK";
  }
  async deleteNote(id: ID): Promise<string> {
    return "OK";
  }
  async createCategory(userId: ID, content: ICategory): Promise<string> {
    return "OK";
  }
  async updateCategory(id: ID, content: ICategoryContent): Promise<string> {
    return "OK";
  }
  async deleteCategory(id: ID): Promise<string> {
    return "OK";
  }
  async addCategoryNote(categoryId: ID, noteId: ID): Promise<string> {
    return "OK";
  }
  async deleteCategoryNote(categoryId: ID, noteId: ID): Promise<string> {
    return "OK";
  }
}
