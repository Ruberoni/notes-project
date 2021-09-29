import React, { ReactElement } from "react";
import {
  VStack,
  StackProps,
  HStack,
  Box,
  Wrap,
  Textarea,
} from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";
import { RemovableCategoryTag, AddCategoryTag } from "./CategoryTag";
import { useNoteContent } from "../hooks";
import { INote } from "../types";

export interface NoteContentProps extends StackProps {
  body?: INote["body"];
  title?: INote["title"];
  categories?: INote["categories"];
}

export default function NoteContent(props: StackProps): ReactElement {
  const [note, , utils] = useNoteContent();

  return (
    <VStack h="inherit" w="100%" bg="lightblue" {...props}>
      <HStack spacing="0px" align="normal" w="inherit" bg="gray.100">
        <VStack w="inherit">
          <Textarea
            bg="red.100"
            fontSize="2em"
            fontWeight="bold"
            p="0 10px"
            minH="unset"
            overflow="hidden"
            w="100%"
            resize="none"
            minRows={1}
            value={note.title}
            onChange={utils.handleTitleChange}
            as={ResizeTextarea}
          />
          <Wrap w="inherit" pl="10px" bg="purple.100">
            {note.categories?.map((category) => (
              <RemovableCategoryTag
                key={category.id}
                onRemove={utils.handleCategoryRemove}
                {...category}
              />
            ))}
            <AddCategoryTag onAdd={utils.handleAddCategoryNote} />
          </Wrap>
        </VStack>
        <Box w="30px" h="30px" bg="yellow"></Box>
      </HStack>
      <Textarea
        h="inherit"
        bg="green.100"
        resize="none"
        value={note.body || ""}
        onChange={utils.handleBodyChange}
        focusBorderColor="none"
      />
    </VStack>
  );
}
