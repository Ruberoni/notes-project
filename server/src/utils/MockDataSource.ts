import { IUser, INote, INotePreview, ICategory } from "../graphql";

export default class MockDataSource {
  // readonly DB: Connection | undefined;
  async getUser(id: string): Promise<IUser> {
    const user = async () => ({
      id,
      google_id: "SAMPLE",
      email: "JohnDoe@gmail.com",
      name: "John Doe",
    });
    return await user();
  }

  async getUserNotes(userId: string): Promise<INote[]> {
    const notes = async () => [
      {
        id: "SAMPLE",
        user: userId,
        title: "SAMPLE",
        body: "SAMPLE",
      },
    ];
    return await notes();
  }
  /*
  async getUserCategories(userId: string): Promise<ICategory[]> {
    return await categories()
  }
  
   * Retrieve all user notes with its categories but every note WILL NOT have its Body.
   
  async getUserNotesPreview(userId: string): Promise<INotePreview[]> {
    return await notesPreview()
  }

  async getNoteBody(noteId: string): Promise<string> {
    return await noteBody()
  }
  */
}
