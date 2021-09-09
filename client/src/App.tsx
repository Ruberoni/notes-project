import { Button } from "@chakra-ui/button";
import React, { useState } from "react";
import CategoryTag from "./components/CategoryTag";
import NoteItem, { HScrollTest } from "./components/NoteItem";
import NotesList from "./components/NotesLists";

function App(): JSX.Element {
  const categories = [<CategoryTag key={1} label="Personal" color="green" />];

  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <div>
      <NotesList>
        <NoteItem
          title="Very long title that wont fit in a small space"
          categories={categories}
          isReady={isReady}
          // isActive={isActive}
          // setIsActive={setIsActive}
        />
        <NoteItem title="Another" categories={categories} isReady={isReady} />
      </NotesList>
      <Button onClick={() => setIsReady(!isReady)}>Toggle isReady</Button>
    </div>
  );
}

export default App;
