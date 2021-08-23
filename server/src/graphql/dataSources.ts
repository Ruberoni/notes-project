import { Connection, RowDataPacket, FieldPacket } from "mysql2/promise";
import { DataSource } from "apollo-datasource";
import { connection } from "../config/database";

export class NotesProjectDataSource extends DataSource {
  DB: Connection | undefined;

  constructor() {
    super();
    this.DB = connection;
  }

  async getUser(id: string): Promise<any> {
    if (!this.DB) throw new Error("No database connected.");
    const [users, _]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(
      "SELECT * FROM user WHERE id = ?",
      [id]
    );
    return users[0];
  }

  async getUserNotes(userId: string): Promise<any> {
    if (!this.DB) throw new Error("No database connected.");
    const [notes, _]: [RowDataPacket[], FieldPacket[]] = await this.DB.execute(
      `SELECT n.* FROM note n JOIN user u WHERE n.user = ? AND u.id = n.user`,
      [userId]
    );
    return notes;
  }

  async getUserCategories(userId: string): Promise<any> {
    if (!this.DB) throw new Error("No database connected.");
    const [categories, _]: [RowDataPacket[], FieldPacket[]] =
      await this.DB.execute(
        `SELECT c.* FROM category c JOIN user u WHERE c.user = ? AND u.id = c.user`,
        [userId]
      );
    return categories;
  }
  /**
   * Retrieve all user notes with its categories but every note WILL NOT have its Body.
   */
  async getUserNotesPreview(userId: string): Promise<INotePreview[]> {
    if (!this.DB) throw new Error("No database connected.");
    const [notesPreview, _]: [RowDataPacket[], FieldPacket[]] =
      await this.DB.execute(
        `SELECT n.id as note_id, n.title, c.id as category_id, c.label, c.color 
          FROM note_category nc 
            JOIN note n ON nc.note = n.id 
            JOIN category c ON nc.category = c.id 
          WHERE n.user = ?;`,
        [userId]
      );
    /**
     * 'notesPreview'
     *  Each repeated 'note_id' in 'notesPreview' means that its categories_id will be different
     */

    /*
    notesPreview = [
      {note_id: 1, title: 'Corazon', category_id: 1, label: 'l', color: null},
      {note_id: 1, title: 'Corazon', category_id: 2, label: 'g', color: null},
      {note_id: 2, title: 'Raza', category_id: 3, label: 'z', color: null}
    ]
    notesPreviewClean = [
      {note_id: 1, title: 'Corazon', categories: [
        {id: 1, label: 'l', color: null}, 
        {id: 2, label: 'g', color: null}
      ]},
      {note_id: 2, title: 'Raza', categories: 
        [{id: 3, label: 'z', color: null}
      ]}
    ]
    */
    /**
     * Fill 'notesPreviewDict' with an object with the 'notesPreview' data but with an extra 'categories' prop.
     * that'll have the categories data.
     * notesPreviewDict will be something like this: {note.id: {...noteData, categories: [{...categoryData}]}
     */
    const notesPreviewDict: { [key: string]: INotePreview } = {};
    for (let noteP of notesPreview) {
      const categoryData: ICategory = {
        id: noteP.category_id,
        label: noteP.label,
        color: noteP.color,
      };

      if (!notesPreviewDict[noteP.id]) {
        notesPreviewDict[noteP.id] = {
          id: noteP.id,
          title: noteP.title,
          categories: [categoryData],
        };
        continue;
      }
      notesPreviewDict[noteP.id].categories.push(categoryData);
    }

    // Return an array from 'notesPreviewDict'
    return Object.values(notesPreviewDict);
  }

  async getNoteBody(noteId: string): Promise<string> {
    if (!this.DB) throw new Error("No database connected.");
    const [noteBody, _]: [RowDataPacket[], FieldPacket[]] =
      await this.DB.execute("SELECT body FROM note WHERE id = ?", [noteId]);
    // OR operator needed as 'noteBody[0].body' in DB its datatype is 'TEXT' and its default value is NULL.
    return noteBody[0].body || "";
  }
}

export interface ICategory {
  id: string;
  user?: string;
  label?: string;
  color?: string;
}

export interface INotePreview {
  id?: string;
  title?: string;
  categories: ICategory[];
}
