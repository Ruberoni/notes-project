import { expect } from "chai";
import { cleanNotesPreview } from "../utils";

describe("Utils", () => {
  describe.skip("cleanNotesPreview", () => {
    it("aa", () => {
      const notesPreview = [
        {
          note_id: 1,
          title: "Very long title that wont fit in a small space",
          category_id: 2,
          label: "Ocio",
          color: "BLUE",
        },
        {
          note_id: 2,
          title: "Home",
          category_id: 1,
          label: "Home",
          color: "RED",
        },
        {
          note_id: 2,
          title: "Home",
          category_id: 4,
          label: "TO DO",
          color: "BLACK",
        },
        {
          note_id: 3,
          title: "Vacations 12/2021",
          category_id: 3,
          label: "Vacations",
          color: "PURPLE",
        },
        {
          note_id: 3,
          title: "Vacations 12/2021",
          category_id: 4,
          label: "TO DO",
          color: "BLACK",
        },
      ];
      const expectedData = [{}];

      const notesPreviewCleaned = cleanNotesPreview(notesPreview);

      expect(notesPreviewCleaned).to.deep.equal(expectedData);
    });
  });
});
