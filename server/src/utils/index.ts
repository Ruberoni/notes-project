import { GraphQLError } from "graphql";
import { RowDataPacket } from "mysql2/promise";
import { NotePreview, Category } from "../graphql";
// import { INotePreview, ICategory } from "../graphql/dataSources";
export { default as MockNPDataSource } from "./MockNPDataSource";
export type NPCleaned = { [key: string]: NotePreview };
/**
 * Clean and organize data for match 'Note' schema.
 * Group repeated notes by 'note_id' and the remaining 'category' data is organized
 * in a new prop. 'categories'
 */
/*
EXAMPLE CASE:
  INPUT:
  [
    {note_id: 1, title: 'Corazon', category_id: 1, label: 'l', color: null},
    {note_id: 1, title: 'Corazon', category_id: 2, label: 'g', color: null},
    {note_id: 2, title: 'Raza', category_id: 3, label: 'z', color: null}
  ]

  OUTPUT:
  [
    {note_id: 1, title: 'Corazon', categories: [
      {id: 1, label: 'l', color: null}, 
      {id: 2, label: 'g', color: null}
    ]},
    {note_id: 2, title: 'Raza', categories: 
      [{id: 3, label: 'z', color: null}
    ]}
  ]
*/
export interface INotesPreview {
  note_id: number;
  title: string;
  category_id: number;
  label: string;
  color: string;
}
export function cleanNotesPreview(
  notesPreview: RowDataPacket[] | INotesPreview[]
): NPCleaned {
  const notesPreviewCleaned: NPCleaned = {};
  for (const noteP of notesPreview) {
    // for each row, creates a category object, only if there's category data

    const categoryData: Category = {
      id: noteP.category_id,
      label: noteP.label,
      color: noteP.color,
    };

    if (!notesPreviewCleaned[noteP.note_id]) {
      notesPreviewCleaned[noteP.note_id] = {
        id: noteP.note_id,
        title: noteP.title,
        categories: categoryData.id ? [categoryData] : [],
      };
      continue;
    }
    if (categoryData.id) {
      notesPreviewCleaned[noteP.note_id].categories.push(categoryData);
    }
  }
  return notesPreviewCleaned;
}

export function isDatabaseError(err: GraphQLError): boolean {
  return Object.prototype.hasOwnProperty.call(err.originalError, "sql");
}

export function getBearerValue(bearer: string): string | undefined {
  if (bearer?.startsWith("Bearer ")){
    return bearer.substring(7, bearer.length);
  }
}