import React, { ReactElement, useState } from "react";
import {
  VStack,
  StackProps,
  HStack,
  Box,
  Heading,
  Wrap,
  Textarea,
} from "@chakra-ui/react";
import { RemovableCategoryTag } from "./CategoryTag";
import { useNoteContent } from "../hooks";
import { INote } from '../types'

export interface NoteContentProps extends StackProps {
  body?: INote["body"];
  title?: INote["title"];
  categories?: INote["categories"]
}

/**
 * @useNoteContent [implementing]
 */
export default function NoteContent({title, body, categories, ...props}: NoteContentProps): ReactElement {
  const [note, ,{ handleCategoryRemove, handleBodyChange }] = useNoteContent()
  // const [categories, setCategories] = useState(note.categories || props.categories || [])
  // const [body, setBody] = useState(note.body || props.body || "")

  // const handleBodyChange = (event: BaseSyntheticEvent) => {
  //   const body = event.target.value
  //   setBody(body)
  // }
  // const handleCategoryRemove = (id: string) => {
  //   const _categories = categories.filter(cat => cat.id !== id)
  //   setCategories(_categories)
  // }
  
  return (
    <VStack h="inherit" w="100%" bg="lightblue" {...props}>
      <HStack spacing="0px" align="normal" w="inherit" bg="gray.100">
        <VStack w="inherit">
          <Heading w="inherit" pl="10px" bg="red.100">
            {note.title || ""}
          </Heading>
          <Wrap w="inherit" pl="10px" bg="purple.100">
          {note.categories?.map((category) => (
            <RemovableCategoryTag key={category.id} onRemove={handleCategoryRemove} {...category}  />
          ))}
          </Wrap>
        </VStack>
        <Box w="30px" h="30px" bg="yellow"></Box>
      </HStack>
      <Textarea
        h="inherit"
        bg="green.100"
        resize="none"
        value={note.body || ""}
        onChange={handleBodyChange}
        focusBorderColor="none"
      />
    </VStack>
  );
}
