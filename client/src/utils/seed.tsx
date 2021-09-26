/*
notePreview data object 
[
  {
    id:,
    user:,
    title:,
    categories: [
      {
        id:,
        label:,
        color:
      }
    ]
  }
] */
export const categories = {
  1: {
    id: "1",
    label: "Personal",
    color: "red",
  },
  2: {
    id: "2",
    label: "Code",
    color: "green",
  },
  3: {
    id: "3",
    label: "Work",
    color: "blue",
  },
  4: {
    id: "4",
    label: "Home",
    color: "purple",
  },
};

export const notes = {
  1: {
    id: "1",
    // user: "",
    title: "Very long title that wont fit in a small space",
    categories: [categories[1], categories[4]],
  },
  2: {
    id: "2",
    // user: "",
    title: "Home work",
    categories: [categories[2], categories[3]],
  },
  3: {
    id: "3",
    // user: "",
    title: "To do",
    categories: [categories[1], categories[4], categories[3], categories[2]],
  },
  4: {
    id: "4",
    // user: "",
    title: "Vacations Dec 2021",
    categories: [categories[3]],
  },
};

export const noteBodies = {
  1: {
    body: "Hellooo",
    note: "1",
  },
  2: {
    body: "Lorem impse",
    note: "2",
  },
  3: {
    body: "Pablo clavó un clavito",
    note: "3",
  },
  4: {
    body: "Byeeeee",
    note: "4",
  },
}

export const notePreview = [notes[1], notes[2], notes[3], notes[4]];
export const categoriesList = Object.values(categories)
export const bodiesList = Object.values(noteBodies)
