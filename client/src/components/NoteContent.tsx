import React, { ReactElement } from "react";
import {
  VStack,
  StackProps,
  Wrap,
  Textarea,
  Center,
  Spinner,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import ResizeTextarea from "react-textarea-autosize";
import RichTextEditor from 'react-rte';
import CategoryList from "./CategoryList";
import { RemovableCategoryTag, AddCategoryTag } from "./CategoryTag";
import { useNoteContent } from "../hooks";
import { INote } from "../types";
import Button from "./common/Button";

export interface NoteContentProps extends StackProps {
  body?: INote["body"];
  title?: INote["title"];
  categories?: INote["categories"];
}

export default function NoteContent(props: StackProps): ReactElement {
  const [note, loading, utils] = useNoteContent();

  if (!note || !utils)
    return (
      <Center h="inherit" w="100%">
        <Heading color="gray.300" size="4xl" userSelect="none">
          Notes Project
        </Heading>
      </Center>
    );

  if (loading) {
    return (
      <Center h="inherit" w="100%">
        <Spinner />
      </Center>
    );
  }

  return (
    <VStack h="100%" w="100%" {...props}>
      <Flex align="normal" w="inherit">
        <VStack w="inherit">
          <Textarea
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
            border="0px"
          />
          <Wrap w="inherit" pl="10px">
            {note.categories?.map((category) => (
              <RemovableCategoryTag
                key={category.id}
                onRemove={utils.handleCategoryRemove}
                {...category}
              />
            ))}

            <CategoryList
              categories={note.categories || []}
              gutter={1}
              buttonAs={<AddCategoryTag />}
            />
          </Wrap>
        </VStack>
        <Button
          w='30px'
          h='30px'
          alignSelf='center'
          m='0 calc(2vw + 16px) 0 1%'
          onClick={utils.handleDeleteNote}
          aria-label="Delete note"
          >
          <DeleteIcon/>
        </Button>
      </Flex>
      <RichTextEditor
        value={note.body || RichTextEditor.createEmptyValue()}
        onChange={utils.handleBodyChange}
        rootStyle={{
          overflow: "auto",
          width: "100%",
          borderBottom: 0,
          backgroundColor: "transparent",
          borderWidth: 0
        }}
        toolbarStyle={{
          borderWidth: 0,
          color: 'black'
        }}
      />
    </VStack>
  );
}
