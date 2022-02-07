import React from "react";
import NotesList from "./components/NotesLists";
import LateralSection from "./components/LateralSection";
import NoteContent from "./components/NoteContent";
import AccesibilityBar from "./components/AccesibilityBar";
import { HStack } from "@chakra-ui/react";
import { NoteContextProvider } from "./context";

function App(): JSX.Element {
  return (
    <HStack flex={1} spacing={0} overflow="auto">
      <NoteContextProvider>
        <LateralSection maxWidth="30%">
          {(filter, setFilter) => (
            <>
              <AccesibilityBar filter={filter} setFilter={setFilter} />
              <NotesList filter={filter} />
            </>
          )}
        </LateralSection>
        <NoteContent />
      </NoteContextProvider>
    </HStack>
  );
}

export default App;
