import React from "react";
import NotesList from "./components/NotesLists";
import LateralSection from "./components/LateralSection";
import NoteContent from "./components/NoteContent";
import AccesibilityBar from "./components/AccesibilityBar";
import { HStack } from "@chakra-ui/react";
import { NoteContextProvider } from "./context";

function App(): JSX.Element {
  return (
    <HStack h="92vh" spacing={0}>
      {/* <LateralSection /> */}
      {/* <AccesibilityBar /> */}
      {/* <NotesList /> */}
      {/* <TopBar /> */}
      {/* This is the App component */}
      {/**
       * LateralSection can be written as:
       * <LateralSection>
       *    <AccesibilityBar />
       *    <NotesList />
       * </LateralSection>
       * But I have to remove AccesibilityBar and NotesList from LateralSection internals.
       */}
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
