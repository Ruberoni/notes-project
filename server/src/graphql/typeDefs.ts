// import { gql } from "apollo-server-hapi";
import "reflect-metadata";
import {
  ObjectType,
  InputType,
  Field,
  ID,
  registerEnumType,
} from "type-graphql";
import { MaxLength, IsEmail } from "class-validator";

/**
 * Types
 */
@ObjectType()
export class User {
  @Field((_type) => ID, { nullable: false })
  id: string;

  @Field()
  googleId?: string;

  @Field()
  oauthId?: string;

  @Field()
  email?: string;

  @Field()
  name?: string;

  @Field((_type) => [Note])
  notes?: Note[];

  @Field((_type) => [Category])
  categories?: Category[];
}

@ObjectType()
export class Note {
  @Field((_type) => ID, { nullable: false })
  id: string;

  @Field((_type) => User)
  user?: User;

  @Field()
  title?: string;

  @Field()
  body?: string;

  @Field((_type) => [Category])
  categories?: [Category];
}

@ObjectType()
export class Category {
  @Field((_type) => ID, { nullable: false })
  id: string;

  @Field((_type) => User)
  user?: User;

  @Field()
  label?: string;

  @Field((_type) => EColor)
  color?: EColor;
}

// https://typegraphql.com/docs/enums.html#interoperability
export enum EColor {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  BLACK = "BLACK",
  GRAY = "GRAY",
  PURPLE = "PURPLE",
  ORANGE = "ORANGE",
  DARKBLUE = "DARKBLUE",
  DARKRED = "DARKRED",
}

registerEnumType(EColor, {
  name: "EColor",
  description: "The colors of the categories.",
});

@ObjectType()
export class NotePreview {
  @Field((_type) => ID)
  id: string;

  @Field()
  title: string;

  @Field((_type) => [Category])
  categories: Category[];
}

/**
 * Inputs
 */
@InputType()
export class UserContent implements Partial<User> {
  @Field()
  @MaxLength(300)
  googleId?: string;

  @Field()
  @MaxLength(100)
  oauthId?: string;

  @Field()
  @MaxLength(300)
  @IsEmail()
  email?: string;

  @Field()
  @MaxLength(100)
  name?: string;
}

@InputType()
export class NoteContent implements Partial<Note> {
  @Field()
  @MaxLength(500)
  title?: string;

  @Field()
  @MaxLength(15000)
  body?: string;
}

@InputType()
export class CategoryContent implements Partial<Category> {
  @Field()
  @MaxLength(50)
  label?: string;

  @Field((_type) => EColor)
  color?: EColor;
}

/*
export default gql`
  type Query {
    getUser(id: ID!): User
    getUserNotes(userid: ID!): [Note]
    getUserCategories(userid: ID!): [Category]

    """
    Retrieve all user notes with its categories but every note WILL NOT have its Body.
    """
    getUserNotesPreview(userId: ID!): [Note]

    getNoteBody(noteId: ID!): String

    test: String
  }

  type User {
    id: ID!
    googleId: String
    email: String
    name: String
    notes: [Note]
    categories: [Category]
  }

  type Note {
    id: ID!
    user: User
    title: String
    body: String
    categories: [Category]
  }

  type Category {
    id: ID!
    user: User
    label: String
    color: Color
  }

  enum Color {
    RED
    BLUE
    GREEN
    BLACK
    GRAY
    PURPLE
    ORANGE
    DARKBLUE
    DARKRED
  }

  input UserContent {
    googleId: String
    email: String
    name: String
  }

  input NoteContent {
    title: String
    body: String
  }

  input CategoryContent {
    label: String
    color: Color
  }

  type Mutation {
    register(content: UserContent): User
    deleteUser(id: ID): String

    createNote(userId: ID!, content: NoteContent): Note
    updateNote(id: ID!, content: NoteContent): Note
    deleteNote(id: ID!): String

    createCategory(userId: ID!, content: CategoryContent): Category
    updateCategory(id: ID!, content: CategoryContent): Category
    deleteCategory(id: ID!): String

    addCategoryNote(categoryId: ID!, noteId: ID!): String
    deleteCategoryNote(categoryId: ID!, noteId: ID!): String
  }
`;
*/
