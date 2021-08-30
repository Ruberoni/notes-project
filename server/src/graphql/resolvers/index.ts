import queries from "./queries";
import mutations from "./mutations";

export * from "./queries";

export default {
  Query: queries,
  Mutation: mutations,
  User: {
    async notes(parent: any, args: any, context: any, info: any): Promise<any> {
      // console.log("info.fieldNodes.name.value:", info.fieldNodes.name.value);
      // select

      // 3 cases selection.name.value
      type IFieldsNodesNames = { [key: string]: boolean };
      function getFieldsNodesNames(
        info: any,
        parent: number
      ): IFieldsNodesNames {
        const fieldNodesNames: IFieldsNodesNames = {};
        for (const field of info.fieldNodes[parent].selectionSet.selections) {
          fieldNodesNames[field.name.value] = true;
        }
        return fieldNodesNames;
      }
      const fields = getFieldsNodesNames(info, 0);
      const fieldsLen = Object.keys(fields).length;
      console.log("fields.body:", fields.body);
      if (fields.body) {
        console.log("e");
        const notes = await context.dataSources.notesProject.getUserNotes(
          parent.id
        );
        notes.forEach((val: any, i: number) => {
          if (!val.body) {
            notes[i].body = "";
          }
        });
        return notes;
      }
      console.log("i");

      // console.log("fieldNodesNames:", fieldNodesNames);
      return await context.dataSources.notesProject.getUserNotesPreview(
        parent.id
      );
    },
  },
};
