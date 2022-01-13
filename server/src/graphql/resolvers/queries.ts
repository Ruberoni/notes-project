import { Resolver, Query, Ctx, Arg, Authorized, UseMiddleware } from "type-graphql";
import { User, Note, Category, NotePreview } from "../typeDefs";
import { ExposeUser } from '../middlewares'
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
  @UseMiddleware(ExposeUser)
  @Query((_returns) => User)
  async getUser(@Arg("id") id: string, @Ctx() ctx: any): Promise<User> {
    return await ctx.dataSources.notesProject.getUser(ctx.user.id || id);
  }

  @Authorized()
  @UseMiddleware(ExposeUser)
  @Query((_returns) => [Note])
  async getUserNotes(
    @Arg("userId") userId: string,
    @Ctx() ctx: any
  ): Promise<Note[]> {
    return await ctx.dataSources.notesProject.getUserNotes(ctx.user.id || userId);
  }

  @Authorized()
  @UseMiddleware(ExposeUser)
  @Query((_returns) => [Category])
  async getUserCategories(
    @Arg("userId") userId: string,
    @Ctx() ctx: any
  ): Promise<Category[]> {
    return await ctx.dataSources.notesProject.getUserCategories(ctx.user.id || userId);
  }

  @Authorized()
  @UseMiddleware(ExposeUser)
  @Query((_returns) => [NotePreview])
  async getUserNotesPreview(
    @Arg("userId") userId: string,
    @Ctx() ctx: any
  ): Promise<NotePreview[]> {
    return await ctx.dataSources.notesProject.getUserNotesPreview(ctx.user.id || userId);
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
