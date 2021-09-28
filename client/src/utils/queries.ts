import { gql } from "@apollo/client";

/**
 * @param {string} userId String
 * */
export const GET_NOTES_PREVIEW = gql`
  query GetNotesPreview($userId: String) {
    getUserNotesPreview(userId: $userId) {
      id
      title
      categories {
        id
        label
        color
      }
    }
  }
`;

export const GET_TEST = gql`
  query Test {
    test
  }
`;

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($googleId: String!) {
    googleLogin(googleId: $googleId) {
      id
      googleId
      email
      name
    }
  }
`;

export const GOOGLE_REGISTER = gql`
  mutation GoogleRegister($userContent: UserContent!) {
    register(userContent: $userContent)
  }
`;

/**
 * @param id String. The note id to retrieve its note body
 */
export const GET_NOTE_BODY = gql`
  query GetNoteBody($id: String!) {
    getNoteBody(id: $id)
  }
`
/**
 * @param categoryId String.
 * @param noteId String.
 */
export const DELETE_CATEGORY_NOTE = gql`
mutation DeleteCategoryNote($categoryId: String!, $noteId: String!) {
  deleteCategoryNote(categoryId: $categoryId, noteId: $noteId)
}
`