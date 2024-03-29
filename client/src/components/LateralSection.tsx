import React, { useState, ReactNode, createContext, useContext, useMemo } from "react";
import {
  VStack,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  StackProps,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAppContext } from "../context";
import { Resizable } from "re-resizable";

export interface ILateralSection extends StackProps{
  children: ReactNode
}

export interface ILateralSectionContext {
  filter: string[]
  setFilter: React.Dispatch<React.SetStateAction<string[]>>
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Context = createContext<ILateralSectionContext | undefined>(undefined);

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
  const { state: { isMobile } } = useAppContext()
  const [filter, setFilter] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')


  const [isDrawerOpen, setDrawerOpen] = useState(false);
  function closeDrawer() {
    setDrawerOpen(false);
  }
  function openDrawer() {
    setDrawerOpen(true);
  }

  const getLateralSection = (children: ReactNode) => {
    if (isMobile) {
      return (
        <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} placement="left">
          <DrawerOverlay>
            <DrawerContent h="100vh">{children}</DrawerContent>
          </DrawerOverlay>
        </Drawer>
      );
    }
    return children;
  }

  const contextValue = useMemo(() => {
    return {
      filter,
      setFilter,
      setDrawerOpen,
      searchQuery,
      setSearchQuery
    }
  }, [
    filter,
    setFilter,
    setDrawerOpen,
    searchQuery,
      setSearchQuery
  ])

  return (
    <Context.Provider value={contextValue}>
      {isMobile && (
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
      {getLateralSection(
        <Resizable
          defaultSize={{
            height: '100%',
            width: isMobile ? '100%' : "30%"
          }}
          enable={{ top:false, right: !isMobile, bottom:false, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
          maxWidth={isMobile ? '100%' : "70%"}
          minWidth="274px"
        >
          <VStack h="100%" w="100%" spacing={0} {...props}>
            {children}
          </VStack>
        </Resizable>
      )}
    </Context.Provider>
  );
}

export const useLateralSectionContext = (): ILateralSectionContext => {
  const context = useContext(Context);
  if (context === undefined)
    throw new Error("Cannot use useLateralSectionContext outside LateralSection.");
  return context;
}