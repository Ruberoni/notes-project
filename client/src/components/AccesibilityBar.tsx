import React, { memo } from "react";
import {
  IconButton,
  HStack,
  StackProps,
  Flex,
  Spacer,
  FlexProps,
  IconButtonProps,
  Icon,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useNoteContext, useAppContext } from "../context";
import { INote } from "../types";
import { UserCategoryListMemo } from './CategoryList'
import CategoriesFilter from "./CategoriesFilter";
import { useCreateNoteMutation } from "../api/notes";
import Button from "./common/Button";
import { FaFilter } from 'react-icons/fa'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { useLateralSectionContext } from "./LateralSection";
import RichTextEditor from "react-rte";

export default function NotesAccesibilityBar(props: StackProps): JSX.Element {

  const appContext = useAppContext()
  const { filter, setFilter, setDrawerOpen } = useLateralSectionContext()

  const { setNotesList, changeCurrentNote} = useNoteContext();
  const [createNote, createNoteMutation] = useCreateNoteMutation()

  const onCreateNote = async () => {
    const res = await createNote({
      variables: {
        userId: appContext.state.userId as string,
        content: {}
      }
    })
    const note: INote = {
      id: res?.data?.createNote.id as string,
      title: "",
      categories: [],
      body: RichTextEditor.createEmptyValue()
    };
    setNotesList((notesList) => [...notesList, note]);
    changeCurrentNote(note);
    setDrawerOpen(false)
  };

  return (
    <Flex h="56px" pl="6.5%" w="inherit" alignItems="center" borderBottom='1px solid' borderColor='border' {...props}>
      <CategoriesFilter
        filter={filter}
        setFilter={setFilter}
        triggerButton={
          <Button w="30px" h="30px" isActive={Boolean(filter.length)}>
            {" "}
            <Icon as={FaFilter} w="11px" h="11px" />{" "}
          </Button>
        }
      />
      <UserCategoryListMemo
        enabled={false}
        triggerButton={userCategoriesListButton}
      />
      <Button
        w="36px"
        h="36px"
        isActive
        marginLeft="auto"
        mr='10px'
        onClick={onCreateNote}
        disabled={!appContext.state.userId || createNoteMutation.loading}
        isLoading={createNoteMutation.loading}
      >
        <AddIcon />
      </Button>
    </Flex>
  );
}

const userCategoriesListButton = (
  <Button marginLeft="4%" borderRadius={5} h="30px">
    {" "}
    Categories <Icon as={MdKeyboardArrowDown} w="17px" h="17px" />
  </Button>
);

export const NotesAccesibilityBarMemo = memo(NotesAccesibilityBar)

export interface AccesibilityBarProps extends StackProps {
  leftIcon?: IconButtonProps;
  rightIcon?: IconButtonProps;
  children?: JSX.Element | JSX.Element[];
  childrenProps?: FlexProps;
}

/**
 * @deprecated
 * Creates horizontal bar highly customizable.
 * By default the children are in Flex with justifyContent="space-evenly"
 */
export function AccesibilityBar({
  leftIcon,
  rightIcon,
  children,
  childrenProps,
  ...props
}: AccesibilityBarProps): JSX.Element {
  return (
    <HStack h="41px" w="inherit" {...props}>
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
