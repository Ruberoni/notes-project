// import { NotesProjectDataSource } from '../dataSources'

// type dataSourcesType = { dataSources: NotesProjectDataSource }

export default {
  async getUser(
    _: any,
    { id }: { id: string },
    { dataSources }: { dataSources: any }
  ): Promise<any> {
    return await dataSources.notesProject.getUser(id);
  },
  async getUserNotes(
    _: any,
    { userId }: { userId: any },
    { dataSources }: { dataSources: any }
  ): Promise<any> {
    return await dataSources.notesProject.getUserNotes(userId);
  },
  test(): string {
    return "correct test";
  },
};
