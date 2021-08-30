// import { NotesProjectDataSource } from '../dataSources'

// type dataSourcesType = { dataSources: NotesProjectDataSource }
import {
  IUser,
  INote,
  ICategory,
  INotePreview,
  NotesProjectDataSource,
} from "../dataSources";

export interface ResolverContext {
  dataSources: {
    notesProject: NotesProjectDataSource;
  };
}

export interface ResolverParams {
  id: string;
  userId: string;
  noteId: string;
}

export type ResolverParent = Record<any, any>;

export default {
  async getUser(
    _: ResolverParent,
    { id }: ResolverParams,
    { dataSources }: ResolverContext
  ): Promise<IUser> {
    return await dataSources.notesProject.getUser(id);
  },
  async getUserNotes(
    _: ResolverParent,
    { userId }: ResolverParams,
    { dataSources }: ResolverContext
  ): Promise<INote[]> {
    return await dataSources.notesProject.getUserNotes(userId);
  },
  async getUserCategories(
    _: ResolverParent,
    { userId }: ResolverParams,
    { dataSources }: ResolverContext
  ): Promise<ICategory[]> {
    return await dataSources.notesProject.getUserCategories(userId);
  },
  async getUserNotesPreview(
    _: ResolverParent,
    { userId }: ResolverParams,
    { dataSources }: ResolverContext
  ): Promise<INotePreview[]> {
    return await dataSources.notesProject.getUserNotesPreview(userId);
  },
  async getNoteBody(
    _: ResolverParent,
    { noteId }: ResolverParams,
    { dataSources }: ResolverContext
  ): Promise<string> {
    return await dataSources.notesProject.getNoteBody(noteId);
  },
  test(): string {
    return "correct test";
  },
};
