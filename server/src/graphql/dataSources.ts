import { Connection, RowDataPacket, FieldPacket } from "mysql2/promise";
import { DataSource } from "apollo-datasource";
import { connection } from "../config/database";
import { cleanNotesPreview } from "../utils/";

// interface INotesProjectDataSource {}

export class NotesProjectDataSource extends DataSource {
  readonly DB: Connection | undefined;
  // public getUser: (id: string) => Promise<any>;

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
    const [notes, _]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(
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
            JOIN note n ON nc.note = n.id 
            JOIN category c ON nc.category = c.id 
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
