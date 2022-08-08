import React, { memo } from "react";
import {
  Text,
  Center,
  CenterProps,
  Flex,
  HStack,
  Tooltip,
  CircularProgress,
  StackProps,
  SkeletonText,
  VStack,
  LayoutProps,
  SkeletonProps,
  FlexProps,
  useColorModeValue,
} from "@chakra-ui/react";
import CategoryTag, { CategoryTagSkeleton } from "./CategoryTag";
import { INote } from "../types";

export interface NoteItemProps
  extends Omit<INote, "body">,
    Omit<CenterProps, "id" | "title" | "onClick"> {
      isOpen?: boolean;
      onClick?: (arg: React.MouseEvent | React.KeyboardEvent) => void;
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
const NoteItem = ({
    id,
    title,
    categories,
    onClick,
    ...props
}: NoteItemProps): JSX.Element => {
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
  
  const selectedBg = useColorModeValue("#FFE6B6", "#486478");
  
    const bg = props.isOpen ? selectedBg : "transparent";
  
  
    return (
      <Center
        tabIndex={0}
        bg={bg}
        h="122px"
        _hover={{ cursor: "pointer" }}
        onClick={onClick}
        onKeyDown={onClick}
        {...props}
      >
        <Flex
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
          <NoteItemCategoriesMemo categories={categories} />
        </Flex>
      </Center>
    );
};

export default NoteItem

export const NoteItemMemo = memo(NoteItem)

const NoteItemCategories = ({
  categories,
}: {
  categories: INote["categories"];
}) => {
  return (
    <HScroll>
      {categories?.map((category) => (
        <CategoryTag key={category.id} {...category} />
      ))}
    </HScroll>
  );
};

const NoteItemCategoriesMemo = memo(NoteItemCategories)

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

export interface NoteItemSkeletonProps extends FlexProps {
  textWidth?: LayoutProps["w"];
  categories?: SkeletonProps[];
}

export function NoteItemSkeleton({
  textWidth,
  categories,
  ...flexProps
}: NoteItemSkeletonProps): JSX.Element {
  return (
    <Flex h="122px" justify="center" direction="column" alignItems="center" {...flexProps}>
      <VStack w="87%" align="flex-start">
        <SkeletonText
          noOfLines={1}
          skeletonHeight="1.6rem"
          w={textWidth || "90%"}
        />
        <HStack>
          {categories ? (
            categories.map((category, i) => (
              <CategoryTagSkeleton key={i} {...category} />
            ))
          ) : (
            <>
              <CategoryTagSkeleton />
              <CategoryTagSkeleton w="4.5rem" />
              <CategoryTagSkeleton w="3.5rem" />
              <CategoryTagSkeleton w="6rem" />
            </>
          )}
        </HStack>
      </VStack>
    </Flex>
  );
}
