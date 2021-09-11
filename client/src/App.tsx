import { Button } from "@chakra-ui/button";
import React, { useState } from "react";
import CategoryTag from "./components/CategoryTag";
import NoteItem, { HScrollTest } from "./components/NoteItem";
import NotesList from "./components/NotesLists";
import AccesibilityBar from "./components/AccesibilityBar";

/*

Example input data
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
]
*/

function App(): JSX.Element {
  const categories = [
    <CategoryTag key={1} label="Personal" color="green" />,
    <CategoryTag key={2} label="Personal" color="green" />,
    <CategoryTag key={3} label="Coding" color="blue" />,
    <CategoryTag key={4} label="Ocio" color="red" />,
    <CategoryTag key={5} label="Casa" />,
  ];

  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <AccesibilityBar />
      {/*
      <NotesList>
        <NoteItem
          title="Very long title that wont fit in a small space"
          categories={categories}
          isReady={isReady}
          // isActive={isActive}
          // setIsActive={setIsActive}
        />
        <NoteItem title="Another" categories={categories} isReady={isReady} />
        <NoteItem title="Another" categories={categories} isReady={isReady} />
        <NoteItem title="Another" categories={categories} isReady={isReady} />
        <NoteItem title="Another" categories={categories} isReady={isReady} />
        <NoteItem title="Another" categories={categories} isReady={isReady} />
        <NoteItem title="Another" categories={categories} isReady={isReady} />
        <NoteItem title="Another" categories={categories} isReady={isReady} />
      </NotesList>
      <Button onClick={() => setIsReady(!isReady)}>Toggle isReady</Button>
        */}
    </div>
  );
}

export default App;
