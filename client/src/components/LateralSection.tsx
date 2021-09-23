import React, { useState, ReactNode } from "react";
import NotesAccesibilityBar from "./AccesibilityBar";
import NotesList from "./NotesLists";
import {
  VStack,
  Drawer,
  Button,
  DrawerContent,
  useBreakpoint,
  DrawerOverlay,
  StackProps
} from "@chakra-ui/react";

/**
 * Lateral section
 *
 * **Features**
 * - When on mobile phone, displays a drawer
 */
export default function LateralSection(children: ReactNode, props: StackProps): JSX.Element {
  const currentBreakpoint = useBreakpoint();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  function closeDrawer() {
    setDrawerOpen(false);
  }
  function openDrawer() {
    setDrawerOpen(true);
  }
  /**
   * Wraps inside a Chakra UI Drawer a components when the windows size get to a breakpoint
   * @param _breakpoint Breakpoint when the component is wrapped
   * @param component Component to be wrapped inside a drawer
   * @returns The component or the wrapped component.
   */
  function useBreakPointDrawer(breakpoint: string, component: ReactNode) {
    if (currentBreakpoint === breakpoint) {
      return (
        <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} placement="left">
          <DrawerOverlay>
            <DrawerContent h="100vh">{component}</DrawerContent>
          </DrawerOverlay>
        </Drawer>
      );
    }
    return component;
  }

  return (
    <>
      {currentBreakpoint === "base" && (
        <Button position="absolute" left="0" onClick={openDrawer}>
          open drawer
        </Button>
      )}
      {useBreakPointDrawer(
        "base",
        <VStack h="inherit" w="100%" {...props}>
          <NotesAccesibilityBar />
          <NotesList />
          {children}
        </VStack>
      )}
    </>
  );
}
