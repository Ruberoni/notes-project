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
import { useMutation } from "@apollo/client";
import { useNoteContext, useAppContext } from "../context";
import { INote } from "../types";
import { CREATE_NOTE } from "../utils/queries";
import { UserCategoryList } from './CategoryList'

export default function NotesAccesibilityBar(props: StackProps): JSX.Element {
  const appContext = useAppContext()
  const { setNotesList, setCurrentNote, notesList } = useNoteContext();
  console.log("appContext.state.userId:", appContext.state.userId)
  const [createNote, ] = useMutation(CREATE_NOTE, {
    variables: {
      userId: appContext.state.userId,
      content: {}
    },
  });

  const onCreateNote = () => {
    console.log("[NotesAccesibilityBar][onCreateNote]")
    createNote().then(res => {
      const note: INote = {
        id: res.data.createNote.id,
        title: "",
        categories: [],
      };
      setNotesList([...notesList, note]);
      setCurrentNote(note);
    }).catch(err => {
      console.log("[onCreateNote][Network Error] err:", err)
    })
  };

  const rightIcon: IconButtonProps = {
    icon: <AddIcon />,
    "aria-label": "Create note",
    onClick: onCreateNote,
    disabled: Boolean(!appContext.state.userId)
  };
  return (
    <AccesibilityBar rightIcon={rightIcon} {...props}>
      <UserCategoryList />
    </AccesibilityBar>
  );
}

export interface AccesibilityBarProps extends StackProps {
  leftIcon?: IconButtonProps;
  rightIcon?: IconButtonProps;
  children?: JSX.Element | JSX.Element[];
  childrenProps?: FlexProps;
}

/**
 * Creates horizontal bar highly customizable.
 * By default the children are in Flex with justifyContent="space-evenly"
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
