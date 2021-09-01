// import { NotesProjectDataSource } from '../dataSources'

// type dataSourcesType = { dataSources: NotesProjectDataSource }
import { Resolver, Query, Ctx, Arg } from "type-graphql";
import { User, Note, Category, NotePreview } from "../typeDefs";
import { NotesProjectDataSource } from "../dataSources";

/* export interface ResolverContext {
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
 */
@Resolver()
export default class NotesProjectResolver {
  @Query()
  test(): string {
    return "Hola";
  }

  @Query((_returns) => String)
  async asyncTest(): Promise<string> {
    return "Hola desde async!";
  }

  @Query((_returns) => User)
  async getUser(@Arg("id") id: string, @Ctx() ctx: any): Promise<User> {
    return await ctx.dataSources.notesProject.getUser(id);
  }

  @Query((_returns) => [Note])
  async getUserNotes(
    @Arg("userId") userId: string,
    @Ctx() ctx: any
  ): Promise<Note[]> {
    return await ctx.dataSources.notesProject.getUserNotes(userId);
  }

  @Query((_returns) => [Category])
  async getUserCategories(
    @Arg("userId") userId: string,
    @Ctx() ctx: any
  ): Promise<Category[]> {
    return await ctx.dataSources.notesProject.getUserCategories(userId);
  }

  @Query((_returns) => [NotePreview])
  async getUserNotesPreview(
    @Arg("userId") userId: string,
    @Ctx() ctx: any
  ): Promise<NotePreview[]> {
    return await ctx.dataSources.notesProject.getUserNotesPreview(userId);
  }

  @Query((_returns) => String)
  async getNoteBody(
    @Arg("noteId") noteId: string,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.getNoteBody(noteId);
  }
}
