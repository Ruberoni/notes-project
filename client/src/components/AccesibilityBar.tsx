import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  StackProps,
  Flex,
  Spacer,
  FlexProps,
  IconButtonProps,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { useNoteContext } from "../context"
import { INote } from '../types'

export default function NotesAccesibilityBar(props: StackProps): JSX.Element {
  const a = useNoteContext()

  const createNote = () => {
    // fetch: create empty note
    // on resolve: 
      // get note id from response
      // add note to context


    
    // add to context
    const note: INote = {
      id: "-1",
      title: "",
      categories: []
    }
    a.setNotesList([...a.notesList, note])
    a.setCurrentNote(note)
  }

  const rightIcon: IconButtonProps = {
    icon: <AddIcon />,
    "aria-label": "Create a note",
    onClick: createNote
  };
  return (
    <AccesibilityBar rightIcon={rightIcon} {...props}>
      <InputGroup maxWidth="200px" size="sm">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.900" />
        </InputLeftElement>
        <Input placeholder="Search by title..." />
      </InputGroup>
      <InputGroup maxWidth="200px" size="sm">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.900" />
        </InputLeftElement>
        <Input placeholder="Search by title..." />
      </InputGroup>
    </AccesibilityBar>
  );
}

export interface AccesibilityBarProps extends StackProps{
  leftIcon?: IconButtonProps;
  rightIcon?: IconButtonProps;
  children?: JSX.Element | JSX.Element[];
  childrenProps?: FlexProps;
}

/**
 * Creates a horizontal bar highly customizable.
 * By default the children are in a Flex with justifyContent="space-evenly"
 * @param {IconButtonProps} leftIcon *Optional* An object with the props for the left IconButton
 * @param {IconButtonProps} rightIcon *Optional* An object with the props for the right IconButton
 * @param {FlexProps} childrenProps *Optional* An object with the props for the Flex wrapping the children.
 * @param children *Optional*
 * @returns
 */
export function AccesibilityBar({
  leftIcon,
  rightIcon,
  children,
  childrenProps,
  ...props
}: AccesibilityBarProps): JSX.Element {
  return (
    <HStack h="41px" bg="red.100" w="inherit" {...props}>
      {leftIcon && (
        <>
          <IconButton
            rounded="none"
            bg="#76C9E3"
            h="inherit"
            arialabel="sample"
            {...leftIcon}
          />
          <Spacer />
        </>
      )}
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="space-evenly"
        bg="gray.100"
        {...childrenProps}
      >
        {children || "Use 'children' to insert here any element."}
      </Flex>
      {rightIcon && (
        <>
          <Spacer />
          <IconButton
            rounded="none"
            bg="#76C9E3"
            h="inherit"
            arialabel="sample"
            {...rightIcon}
          />
        </>
      )}
    </HStack>
  );
}
