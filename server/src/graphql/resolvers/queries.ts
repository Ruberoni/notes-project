import { Resolver, Query, Ctx, Arg, Authorized } from "type-graphql";
import { NoteContent } from "..";
import { User, Note, Category, NotePreview } from "../typeDefs";
@Resolver()
export default class Queries {
  @Query()
  test(): string {
    return "Hola";
  }

  @Authorized()
  @Query()
  authTest(): string {
    return "Hola";
  }

  @Query((_returns) => String)
  async asyncTest(): Promise<string> {
    return "Hola desde async!";
  }

  @Authorized()
  @Query((_returns) => User)
  async getUser(@Arg("id") id: string, @Ctx() ctx: any): Promise<User> {
    return await ctx.dataSources.notesProject.getUser(id);
  }

  @Authorized()
  @Query((_returns) => [Note])
  async getUserNotes(
    @Arg("userId") userId: string,
    @Ctx() ctx: any
  ): Promise<Note[]> {
    return await ctx.dataSources.notesProject.getUserNotes(userId);
  }

  @Authorized()
  @Query((_returns) => [Category])
  async getUserCategories(
    @Arg("userId") userId: string,
    @Ctx() ctx: any
  ): Promise<Category[]> {
    return await ctx.dataSources.notesProject.getUserCategories(userId);
  }

  @Authorized()
  @Query((_returns) => [NotePreview])
  async getUserNotesPreview(
    @Arg("userId") userId: string,
    @Ctx() ctx: any
  ): Promise<NotePreview[]> {
    return await ctx.dataSources.notesProject.getUserNotesPreview(userId);
  }

  @Authorized()
  @Query((_returns) => Note)
  async getNote(
    @Arg("id", {nullable: false}) id: string,
    @Ctx() ctx: any
  ): Promise<Note> {
    return await ctx.dataSources.notesProject.getNote(id);
  }

  @Authorized()
  @Query((_returns) => String)
  async getNoteBody(
    @Arg("noteId") noteId: string,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.getNoteBody(noteId);
  }
}
