import { Resolver, Mutation, Ctx, Arg, Authorized, UseMiddleware } from "type-graphql";
import { User, Note, UserContent, NoteContent, CategoryContent } from "../typeDefs";
import { authenticate } from "../../services/auth";
import { ExposeUser } from "../middlewares";
@Resolver()
export default class Mutations {
  @Mutation((_returns) => String)
  async register(
    @Arg("userContent", { nullable: false }) userContent: UserContent,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.register(userContent);
  }


  @Mutation((_returns) => String)
  async googleLogin(
    @Arg("googleId", { nullable: false }) googleId: string,
    @Ctx() ctx: any
  ): Promise<string> {
    const user = await ctx.dataSources.notesProject.googleLogin(googleId);
    if (!user.id)
      throw new Error("Doesn't exist an user with the provided googleId.");

    const token = authenticate(user)
    return token;
  }

  @Authorized()
  @UseMiddleware(ExposeUser)
  @Mutation((_returns) => String)
  async deleteUser(
    @Arg("id", { nullable: false }) id: string,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.deleteUser(ctx.user.id || id);
  }

  @Authorized()
  @UseMiddleware(ExposeUser)
  @Mutation((_returns) => Note)
  async createNote(
    @Arg("userId", { nullable: false }) userId: string,
    @Arg("content", { nullable: false }) content: NoteContent,
    @Ctx() ctx: any
  ): Promise<Note> {
    return await ctx.dataSources.notesProject.createNote(ctx.user.id || userId, content);
  }

  @Authorized()
  @Mutation((_returns) => String)
  async updateNote(
    @Arg("id", { nullable: false }) id: string,
    @Arg("content", { nullable: false }) content: NoteContent,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.updateNote(id, content);
  }

  @Authorized()
  @UseMiddleware(ExposeUser)
  @Mutation((_returns) => String)
  async deleteNote(
    @Arg("id", { nullable: false }) id: string,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.deleteNote(id);
  }

  @Authorized()
  @UseMiddleware(ExposeUser)
  @Mutation((_returns) => String)
  async createCategory(
    @Arg("userId", { nullable: false }) userId: string,
    @Arg("content", { nullable: false }) content: CategoryContent,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.createCategory(ctx.user.id || userId, content);
  }

  @Authorized()
  @Mutation((_returns) => String)
  async updateCategory(
    @Arg("id", { nullable: false }) id: string,
    @Arg("content", { nullable: false }) content: CategoryContent,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.updateCategory(id, content);
  }

  @Authorized()
  @Mutation((_returns) => String)
  async deleteCategory(
    @Arg("id", { nullable: false }) id: string,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.deleteCategory(id);
  }

  @Authorized()
  @Mutation((_returns) => String)
  async addCategoryNote(
    @Arg("categoryId", { nullable: false }) categoryId: string,
    @Arg("noteId", { nullable: false }) noteId: string,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.addCategoryNote(
      categoryId,
      noteId
    );
  }
  
  @Authorized()
  @Mutation((_returns) => String)
  async deleteCategoryNote(
    @Arg("categoryId", { nullable: false }) categoryId: string,
    @Arg("noteId", { nullable: false }) noteId: string,
    @Ctx() ctx: any
  ): Promise<string> {
    return await ctx.dataSources.notesProject.deleteCategoryNote(
      categoryId,
      noteId
    );
  }
}
