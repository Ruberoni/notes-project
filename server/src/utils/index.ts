import { RowDataPacket } from "mysql2/promise";
import { INotePreview, ICategory } from "../graphql/dataSources";
export { default as MockNPDataSource } from "./MockNPDataSource";
export { default as MockDataSource } from "./MockDataSource";

export type NPCleaned = { [key: string]: INotePreview };
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
export function cleanNotesPreview(notesPreview: RowDataPacket[]): NPCleaned {
  const notesPreviewCleaned: NPCleaned = {};
  for (const noteP of notesPreview) {
    // for each row, creates a category object, only if there's category data

    const categoryData: ICategory = {
      id: noteP.category_id,
      label: noteP.label,
      color: noteP.color,
    };

    if (!notesPreviewCleaned[noteP.id]) {
      notesPreviewCleaned[noteP.id] = {
        id: noteP.note_id,
        title: noteP.title,
        categories: categoryData.id ? [categoryData] : [],
      };
      continue;
    }
    if (categoryData.id) {
      notesPreviewCleaned[noteP.id].categories.push(categoryData);
    }
  }
  return notesPreviewCleaned;
}
