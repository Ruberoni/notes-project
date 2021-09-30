import React from "react";
import {
  Text,
  Center,
  CenterProps,
  Flex,
  HStack,
  Tooltip,
  CircularProgress,
  StackProps,
} from "@chakra-ui/react";
import CategoryTag from "./CategoryTag";
import { useNoteItem } from "../hooks";
import { INote } from "../types";

export interface NoteItemProps extends Omit<INote, "body">, Omit<CenterProps, "id" | "title"> {

}

/**
 * **Note item component.**
 *
 * Composed with:
 * - Note title.
 * - Note categories.
 * - Loading icon.
 *
 * Features:
 * - Adaptable to any container (flex).
 * - The Note title is shortened according to the width.
 * - Hovering the mouse in the note title, displays the full title. (Tooltip)
 * - The categories are shortened according to the width.
 * - The categories are scrollable.
 */
export default function NoteItem({
  id,
  title,
  categories,
  ...props
}: NoteItemProps): JSX.Element {
  const [isOpen, onClick] = useNoteItem(id);

  const LoadingComp = (
    <CircularProgress
      position="absolute"
      top="0"
      right="0"
      color="gray.900"
      thickness="2"
      size="3"
      isIndeterminate
    />
  );

  const noteTitle = title || "Note title";
  const bg = isOpen ? "#FFE6B6" : "transparent";

  return (
    <Center
      tabIndex={0}
      bg={/* "blue.100" */ bg}
      h="122px"
      _hover={{ cursor: "pointer" }}
      onClick={onClick}
      onKeyDown={onClick}
      {...props}
    >
      <Flex
        bg="green.100"
        w="87%"
        h="75%"
        justify="center"
        direction="column"
        position="relative"
      >
        {/* {isLoading && LoadingComp} */}

        <Tooltip label={noteTitle} openDelay={500} gutter={0}>
          <Text fontSize="2xl" isTruncated>
            {noteTitle}
          </Text>
        </Tooltip>
        <HScroll bg="red.100">
          {categories?.map((category) => (
            <CategoryTag key={category.id} {...category} />
          ))}
        </HScroll>
      </Flex>
    </Center>
  );
}

export interface HScrollProps extends StackProps {
  children?: JSX.Element | JSX.Element[];
}

/**
 * Displays the 'children' one after another horizontally.
 * If width is not enough to displays all the children, them it become scrollable but
 * the scrollbar is hiden
 */
export function HScroll({ children, ...props }: HScrollProps): JSX.Element {
  return (
    <HStack
      className="hideScrollBar"
      spacing="8px"
      shouldWrapChildren
      {...props}
    >
      {children}
    </HStack>
  );
}

export function HScrollTest(props?: HScrollProps): JSX.Element {
  return (
    <HScroll bg="red.100" className="delHScrollBar" {...props}>
      <CategoryTag label="Personal" color="green" />
      <CategoryTag label="Coding" color="blue" />
      <CategoryTag label="Ocio" color="red" />
      <CategoryTag label="Casa" />
    </HScroll>
  );
}
