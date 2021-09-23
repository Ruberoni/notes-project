import React, { BaseSyntheticEvent, ReactElement, useState } from "react";
import {
  VStack,
  HStack,
  Box,
  Heading,
  Wrap,
  Textarea,
} from "@chakra-ui/react";
import CategoryTag, { CategoryTagProps } from "./CategoryTag";

export interface NoteContentProps {
  body?: string;
  title?: string;
  categories?: CategoryTagProps[]
}

export default function NoteContent(props: NoteContentProps): ReactElement {
  const [body, setBody] = useState(props.body || "")

  const handleBodyChange = (event: BaseSyntheticEvent) => {
    const body = event.target.value
    setBody(body)
  }

  return (
    <VStack h="inherit" w="100%" bg="lightblue">
      <HStack spacing="0px" align="normal" w="inherit" bg="gray.100">
        <VStack w="inherit">
          <Heading w="inherit" pl="10px" bg="red.100">
            {props.title || "."}
          </Heading>
          <Wrap w="inherit" pl="10px" bg="purple.100">
          {props.categories?.map((category) => (
            <CategoryTag key={category.id} {...category} />
          ))}
          </Wrap>
        </VStack>
        <Box w="30px" h="30px" bg="yellow"></Box>
      </HStack>
      <Textarea
        h="inherit"
        bg="green.100"
        resize="none"
        value={body}
        onChange={handleBodyChange}
        focusBorderColor="none"
      />
      {/* <Editable w="inherit" h="inherit" bg="green.100" defaultValue="Take some chakra">
        <EditablePreview h="-webkit-fill-available" w="inherit"/>
        {/**
         * Figure out how to edit texarea styles to look ok
         * Problem with EditableInput height!
         */}
      {/*<EditableInput minHeight="inherit" as="textarea" resize="none" _focus={{outline: "none"}} />
      </Editable> */}
      {/* <Text w="inherit" h="inherit" bg="green.100">
        Note Body
      </Text> */}
    </VStack>
  );
}
