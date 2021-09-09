import React from "react";
import CategoryTag from "./CategoryTag";
import {
  Box,
  Text,
  Center,
  Flex,
  HStack,
  Tooltip,
  CircularProgress,
  useAccordionItem,
} from "@chakra-ui/react";

import { getHideScrollBarCSS } from "../utils";

import { PropGetter } from "@chakra-ui/react-utils";

export interface NoteItemProps {
  title?: string;
  categories?: any;
  isReady?: boolean;
  isActive?: boolean;
  handleOnClick?: any;
  setIsActive?: React.Dispatch<React.SetStateAction<boolean>>;
  [key: string]: any;
}

/**
 * **Note item component.**
 *
 * Has to be inside AccordionProvider and AccordionDescendantsProvider.
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
 *
 * @todo
 * - Title [ ]
 * - Title tooltip [X]
 * - Categories [X]
 * - Loading icon [X]
 * - Toggle background when click use *Implement_accordion_logic* [X]
 *
 * @Implement_accordion_logic
 * - https://github.com/chakra-ui/chakra-ui/blob/main/packages/accordion/src/use-accordion.ts
 * - https://github.com/chakra-ui/chakra-ui/blob/main/packages/accordion/src/accordion.tsx
 * 1. Initialize useAccordionItem
 * 2. Call getButtonProps (from useAccordionItem) with the onClick func and pass its return value as props of 'center' component
 * @notes
 * - The AccordionItemProvider isn't used because it's only used to accordion-only children like AccordionButton.
 */
export default function NoteItem({
  title,
  categories,
  isReady,
  handleOnClick,
}: NoteItemProps): JSX.Element {
  const { isOpen, getButtonProps } = useAccordionItem({
    isFocusable: true,
  });

  /**
   * Function called when the Item is pressed
   */
  const onClick = () => {
    console.log("Hi, I have been clicked!");
    handleOnClick?.();
  };

  const button = getButtonProps({ onClick }) as PropGetter<HTMLDivElement>;

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
      {...button}
      bg={/* "blue.100" */ bg}
      h="122px"
      sx={getHideScrollBarCSS()}
      _hover={{ cursor: "pointer" }}
    >
      <Flex
        bg="green.100"
        w="87%"
        h="75%"
        justify="center"
        direction="column"
        position="relative"
      >
        {isReady && LoadingComp}

        <Tooltip label={noteTitle} openDelay={500} gutter={0}>
          <Text fontSize="2xl" isTruncated>
            {noteTitle}
          </Text>
        </Tooltip>
        <HScroll bg="red.100" className="delHScrollBar">
          {categories}
        </HScroll>
      </Flex>
    </Center>
  );
}

export interface HScrollProps {
  children: JSX.Element | JSX.Element[];
  [key: string]: any;
}

/**
 * Displays the 'children' one after another horizontally.
 */
export function HScroll({ children, ...props }: HScrollProps): JSX.Element {
  return (
    <HStack spacing="8px" shouldWrapChildren {...props}>
      {children}
    </HStack>
  );
}

export function HScrollTest(): JSX.Element {
  return (
    <Box bg="red.100 " w="100px" sx={getHideScrollBarCSS()}>
      <HScroll className="delHScrollBar">
        <CategoryTag label="Personal" color="green" />
        <CategoryTag label="Coding" color="blue" />
        <CategoryTag label="Ocio" color="red" />
        <CategoryTag label="Casa" />
      </HScroll>
    </Box>
  );
}
