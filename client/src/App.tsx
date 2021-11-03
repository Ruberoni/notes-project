import React from "react";
import NotesList from "./components/NotesLists";
import LateralSection from "./components/LateralSection";
import NoteContent from "./components/NoteContent";
import AccesibilityBar from "./components/AccesibilityBar";
import { HStack } from "@chakra-ui/react";
import { NoteContextProvider } from "./context";

function App(): JSX.Element {
  return (
    <HStack flex={1} spacing={0}>
      <NoteContextProvider>
        <LateralSection maxWidth="30%">
          <AccesibilityBar />
          <NotesList />
        </LateralSection>
        <NoteContent />
      </NoteContextProvider>
    </HStack>
  );
}

export default App;
