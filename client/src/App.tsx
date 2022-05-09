import React from "react";
import NotesList from "./components/NotesLists";
import LateralSection from "./components/LateralSection";
import NoteContent from "./components/NoteContent";
import AccesibilityBar from "./components/AccesibilityBar";
import { HStack, useColorModeValue } from "@chakra-ui/react";
import { NoteContextProvider } from "./context";

function App(): JSX.Element {
  const borderColor = useColorModeValue("border.smooth", "border.dark");
  return (
    <HStack flex={1} spacing={0} overflow="auto">
      <NoteContextProvider>
        <LateralSection
          maxWidth="30%"
          borderRight="1px solid"
          borderColor={borderColor}
        >
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
