import React from "react";
import {
  Text,
  Center,
  Flex,
  HStack,
  Tooltip,
  CircularProgress,
  useAccordionItem,
  StackProps
} from "@chakra-ui/react";
import { PropGetter } from "@chakra-ui/react-utils";
import CategoryTag, { CategoryTagProps } from "./CategoryTag";


export interface NoteItemProps {
  id?: string;
  title?: string;
  categories?: CategoryTagProps[];
  isLoading?: boolean;
  isActive?: boolean;
  handleOnClick?: () => void;
  setIsActive?: React.Dispatch<React.SetStateAction<boolean>>;
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
 * - Title [X]
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
  isLoading,
  handleOnClick,
}: NoteItemProps): JSX.Element {
  const { isOpen, getButtonProps } = useAccordionItem({
    isFocusable: true,
  });

  /**
   * Function called when the Item is pressed
   */
  const onClick = () => {
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
        {isLoading && LoadingComp}

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

export function HScrollTest(props?: any): JSX.Element {
  return (
    <HScroll bg="red.100" className="delHScrollBar" {...props}>
      <CategoryTag label="Personal" color="green" />
      <CategoryTag label="Coding" color="blue" />
      <CategoryTag label="Ocio" color="red" />
      <CategoryTag label="Casa" />
    </HScroll>
  );
}