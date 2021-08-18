import { gql } from "apollo-server-hapi";

export default gql`
  type Query {
    getUser(id: ID!): User
    getUserNotes(userid: ID!): [Note]
    getUserCategories(userid: ID!): [Category]

    """
    Retrieve all user notes but every note WILL NOT have its Body.
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
