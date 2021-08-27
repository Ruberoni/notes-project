import { Connection, RowDataPacket, FieldPacket } from "mysql2/promise";
import { DataSource } from "apollo-datasource";
import { connection } from "../config/database";
import { cleanNotesPreview } from "../utils/";

export class NotesProjectDataSource extends DataSource {
  readonly DB: Connection | undefined;

  constructor() {
    super();
    this.DB = connection;
  }

  async getUser(id: string): Promise<IUser> {
    // async getUser(id) {
    if (!this.DB) throw new Error("No database connected.");
    const [users, _]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(
      "SELECT * FROM user WHERE id = ?",
      [id]
    );
    return users[0] as IUser;
  }

  async getUserNotes(userId: string): Promise<INote[]> {
    if (!this.DB) throw new Error("No database connected.");
    const [notes]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(
      `SELECT n.* FROM note n JOIN user u WHERE n.user = ? AND u.id = n.user`,
      [userId]
    );
    return notes as INote[];
  }

  async getUserCategories(userId: string): Promise<ICategory[]> {
    if (!this.DB) throw new Error("No database connected.");
    const [categories, _]: [RowDataPacket[], FieldPacket[]] =
      await this.DB.execute(
        `SELECT c.* FROM category c JOIN user u WHERE c.user = ? AND u.id = c.user`,
        [userId]
      );
    return categories as ICategory[];
  }
  /**
   * Retrieve all user notes with its categories but every note WILL NOT have its Body.
   * BUG
   * If a note doesn't have categories, it won't retrieve it.
   * The query only looks for 'notes' in 'note_category' table,
   * so if a note doesn't have categories, it won't retrieve it.
   */
  async getUserNotesPreview(userId: string): Promise<INotePreview[]> {
    if (!this.DB) throw new Error("No database connected.");
    /**
     * 'notesPreview'
     *  Each repeated 'note_id' in 'notesPreview' means that its categories_id will be different
     */
    const [notesPreview, _]: [RowDataPacket[], FieldPacket[]] =
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
    const [noteBody, _]: [RowDataPacket[], FieldPacket[]] =
      await this.DB.execute("SELECT body FROM note WHERE id = ?", [noteId]);
    // OR operator needed as 'noteBody[0].body' in DB its datatype is 'TEXT' and its default value is NULL.
    return noteBody[0].body || "";
  }

  async register(content: IUser): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    /*await this.DB.execute(
      `INSERT INTO user SET google_id = ?, email = ?, name = ?, ${idQuery}`,
      [
        content.google_id,
        content.email,
        content.name,
        content.id,
      ]
    );*/
    // console.log(content);
    // await this.DB.query(`INSERT INTO user SET ?`, content);
    const query = "INSERT INTO user SET ?";
    // const badValues = ["20; DELETE FROM user;"];
    const queryFormatted = this.DB.format(query, content);
    // const queryFormatted = this.DB.format(query, badValues);

    // await this.DB.execute(query, content);

    // testing Connection.format and Connection.execute, doesn't remove table with sql injection
    /*const query2 = "INSERT INTO user SET name = ?";
    const query2Formatted = this.DB.format(query2, [
      "ruben; DELETE FROM user;",
    ]);
    
    await this.DB.execute(query2Formatted);
    */
    /*const query3 = "SELECT * FROM user";
    const [users, a]: [any, any] = await this.DB.execute(query3);
    console.log("users should have 1 users:", users);*/
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async deleteUser(id: ID): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");

    const query = "DELETE FROM user WHERE id = ?";
    // const queryFormatted = this.DB.format(query, userContent);
    // const [rows, _]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(query, [id]);
    await this.DB.execute(query, [id]);
    return "OK";
  }
  async updateUser(id: ID, content: IUserContent): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "UPDATE user SET ? WHERE id = ?";
    const queryFormatted = this.DB.format(query, [content, id]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async createNote(userId: ID, content: INote): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "INSERT INTO note SET user = ?, ?";
    const queryFormatted = this.DB.format(query, [userId, content]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async updateNote(id: ID, content: INoteContent): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "UPDATE note SET ? WHERE id = ?";
    const queryFormatted = this.DB.format(query, [content, id]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async deleteNote(id: ID): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "DELETE FROM note WHERE id = ?";
    await this.DB.execute(query, [id]);
    return "OK";
  }
  async createCategory(userId: ID, content: ICategory): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "INSERT INTO category SET user = ?, ?";
    const queryFormatted = this.DB.format(query, [userId, content]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async updateCategory(id: ID, content: ICategoryContent): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "UPDATE category SET ? WHERE id = ?";
    const queryFormatted = this.DB.format(query, [content, id]);
    await this.DB.execute(queryFormatted);
    return "OK";
  }
  async deleteCategory(id: ID): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "DELETE FROM category WHERE id = ?";
    await this.DB.execute(query, [id]);
    return "OK";
  }
  async addCategoryNote(categoryId: ID, noteId: ID): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "INSERT INTO note_category(category, note) VALUES (?, ?)";
    await this.DB.execute(query, [categoryId, noteId]);
    return "OK";
  }
  async deleteCategoryNote(categoryId: ID, noteId: ID): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const query = "DELETE FROM note_category WHERE category = ? AND note = ?";
    await this.DB.execute(query, [categoryId, noteId]);
    return "OK";
  }
}

export interface ICategoryContent {
  label?: string;
  color?: string;
}

export interface INoteContent {
  title?: string;
  body?: string;
}

export interface IUserContent {
  google_id?: string;
  email?: string;
  name?: string;
}

export type ID = string | number;

export interface IUser {
  id: ID;
  google_id: string;
  email: string;
  name: string;
  notes?: INote[];
  categories?: ICategory[];
}

export interface INote {
  id: ID;
  user?: ID;
  title: string;
  body?: string | null;
  categories?: ICategory[];
}

export interface INotePreview {
  id: ID;
  title: string;
  categories: ICategory[];
}

export interface ICategory {
  id: ID;
  user?: string;
  label: string;
  color?: string;
}
