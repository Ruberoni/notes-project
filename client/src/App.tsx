import { Button } from "@chakra-ui/button";
import React, { useState } from "react";
import CategoryTag from "./components/CategoryTag";
import NoteItem, { HScrollTest } from "./components/NoteItem";
import NotesList from "./components/NotesLists";
import AccesibilityBar from "./components/AccesibilityBar";
import LateralSection from "./components/LateralSection";
import { TopBar } from "./components/AppBars";

function App(): JSX.Element {
  return (
    <div>
      {/* <LateralSection /> */}
      {/* <AccesibilityBar /> */}
      {/* <NotesList /> */}
      {/* <TopBar /> */}
      This is the App component
      <NotesList />
    </div>
  );
}

export default App;
