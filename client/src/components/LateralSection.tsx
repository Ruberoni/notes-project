import React, { ReactElement, useState, ReactNode } from "react";
import {
  VStack,
  Drawer,
  DrawerContent,
  useBreakpoint,
  DrawerOverlay,
  StackProps,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

export interface ILateralSection extends StackProps{
  children(filter: string[], setFilter: React.Dispatch<React.SetStateAction<string[]>>): ReactElement
}

/**
 * Lateral section
 *
 * **Features**
 * - When on mobile phone, displays a drawer
 */
export default function LateralSection({
  children,
  ...props
}: ILateralSection): JSX.Element {
  const [filter, setFilter] = useState<string[]>([])

  const currentBreakpoint = useBreakpoint();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  function closeDrawer() {
    setDrawerOpen(false);
  }
  function openDrawer() {
    setDrawerOpen(true);
  }
  const onDrawerProps =
    currentBreakpoint === "base" ? { w: "100%", maxWidth: "100%" } : {};

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
        <IconButton
          aria-label="Open notes"
          icon={<HamburgerIcon />}
          position="absolute"
          left="0"
          top="0"
          onClick={openDrawer}
          h="39px"
          w="40px"
          zIndex="1"
          bg="topbar"
          borderRadius={0}
        >
          open drawer
        </IconButton>
      )}
      {useBreakPointDrawer(
        "base",
        <VStack h="100%" w="100%" spacing={0} {...props} {...onDrawerProps}>
          {children(filter, setFilter)}
        </VStack>
      )}
    </>
  );
}
