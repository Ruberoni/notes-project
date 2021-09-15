import { Connection, RowDataPacket, FieldPacket } from "mysql2/promise";
import { DataSource } from "apollo-datasource";
import { connection, connectDB } from "../config";
import { cleanNotesPreview } from "../utils/";
import {
  User,
  Note,
  Category,
  NotePreview,
  UserContent,
  NoteContent,
  CategoryContent,
} from "./typeDefs";

export class NotesProjectDataSource extends DataSource {
  // readonly DB: Connection | undefined;
  DB: any = {};

  constructor() {
    super();
    this.DB = connection;
    // connectDB(undefined, this.DB);
  }

  initialize(): void {
    this.DB = connection;
  }

  async getUser(id: string): Promise<User> {
    // async getUser(id) {
    if (!this.DB) throw new Error("No database connected.");
    const [users]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(
      "SELECT * FROM user WHERE id = ?",
      [id]
    );
    return users[0] as User;
  }

  async getUserNotes(userId: string): Promise<Note[]> {
    if (!this.DB) throw new Error("No database connected.");
    const [notes]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(
      `SELECT n.* FROM note n JOIN user u WHERE n.user = ? AND u.id = n.user`,
      [userId]
    );
    return notes as Note[];
  }

  async getUserCategories(userId: string): Promise<Category[]> {
    if (!this.DB) throw new Error("No database connected.");
    const [categories]: [RowDataPacket[], FieldPacket[]] =
      await this.DB.execute(
        `SELECT c.* FROM category c JOIN user u WHERE c.user = ? AND u.id = c.user`,
        [userId]
      );
    return categories as Category[];
  }
  /**
   * Retrieve all user notes with its categories but every note WILL NOT have its Body.
   * BUG
   * If a note doesn't have categories, it won't retrieve it.
   * The query only looks for 'notes' in 'note_category' table,
   * so if a note doesn't have categories, it won't retrieve it.
   */
  async getUserNotesPreview(userId: string): Promise<NotePreview[]> {
    if (!this.DB) throw new Error("No database connected.");
    /**
     * 'notesPreview'
     *  Each repeated 'note_id' in 'notesPreview' means that its categories_id will be different
     */
    const [notesPreview]: [RowDataPacket[], FieldPacket[]] =
      await this.DB.execute(
        `SELECT n.id as note_id, n.title, c.id as category_id, c.label, c.color 
          FROM note_category nc 
            RIGHT JOIN note n ON nc.note = n.id 
            LEFT JOIN category c ON nc.category = c.id 
          WHERE n.user = ?;`,
        [userId]
      );
    const notesPreviewCleaned = cleanNotesPreview(notesPreview);

    return Object.values(notesPreviewCleaned);
  }

  async getNoteBody(noteId: string): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const [noteBody]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(
      "SELECT body FROM note WHERE id = ?",
      [noteId]
    );
    // OR operator needed as 'noteBody[0].body' in DB its datatype is 'TEXT' and its default value is NULL.
    return noteBody[0].body || "";
  }

  async register(content: UserContent): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "INSERT INTO user SET ?";
    const queryFormatted = this.DB.format(query, content);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async googleLogin(googleId: UserContent["googleId"]): Promise<User> {
    if (!this.DB) throw new Error("No database connected.");
    const query =
      "SELECT id, googleId, email, name FROM user WHERE googleId = ?";
    // const queryFormatted = this.DB.format(query, content);
    const [user]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(
      query,
      [googleId]
    );
    return (user[0] as User) || {};
  }
  async deleteUser(id: string): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");

    const query = "DELETE FROM user WHERE id = ?";
    await this.DB.execute(query, [id]);
    return "OK";
  }
  async updateUser(id: string, content: UserContent): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "UPDATE user SET ? WHERE id = ?";
    const queryFormatted = this.DB.format(query, [content, id]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async createNote(userId: string, content: NoteContent): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "INSERT INTO note SET user = ?, ?";
    const queryFormatted = this.DB.format(query, [userId, content]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async updateNote(id: string, content: NoteContent): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "UPDATE note SET ? WHERE id = ?";
    const queryFormatted = this.DB.format(query, [content, id]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async deleteNote(id: string): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "DELETE FROM note WHERE id = ?";
    await this.DB.execute(query, [id]);
    return "OK";
  }
  async createCategory(userId: string, content: Category): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "INSERT INTO category SET user = ?, ?";
    const queryFormatted = this.DB.format(query, [userId, content]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async updateCategory(id: string, content: CategoryContent): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "UPDATE category SET ? WHERE id = ?";
    const queryFormatted = this.DB.format(query, [content, id]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async deleteCategory(id: string): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "DELETE FROM category WHERE id = ?";
    await this.DB.execute(query, [id]);
    return "OK";
  }
  async addCategoryNote(categoryId: string, noteId: string): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "INSERT INTO note_category(category, note) VALUES (?, ?)";
    await this.DB.execute(query, [categoryId, noteId]);
    return "OK";
  }
  async deleteCategoryNote(
    categoryId: string,
    noteId: string
  ): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "DELETE FROM note_category WHERE category = ? AND note = ?";
    await this.DB.execute(query, [categoryId, noteId]);
    return "OK";
  }
}
