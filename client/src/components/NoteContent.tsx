import React, { ReactElement } from "react";
import {
  VStack,
  StackProps,
  HStack,
  Wrap,
  Textarea,
  IconButton,
  Image,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import ResizeTextarea from "react-textarea-autosize";
import MDEditor from "rich-markdown-editor";
import CategoryList from "./CategoryList";
import { RemovableCategoryTag, AddCategoryTag } from "./CategoryTag";
import { useNoteContent } from "../hooks";
import { INote } from "../types";
import typingImg from "../assets/typing.jpg";

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
        <Image src={typingImg} boxSize="290px" objectFit="cover" alt="Typing" />
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
      <HStack spacing="0px" align="normal" w="inherit">
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
        <IconButton
          onClick={utils.handleDeleteNote}
          aria-label="Delete note"
          colorScheme="red"
          icon={<DeleteIcon />}
        />
      </HStack>
      <MDEditor
        id={note.id}
        value={note.body || ""}
        onChange={utils.handleBodyChange}
        onSave={utils.handleSave}
        onFocus={() => console.log("Focus the MD editor")}
        style={{
          width: "100%",
          wordBreak: "break-all",
          paddingRight: "26px",
          paddingLeft: "26px",
          overflow: "auto",
        }}
      />
    </VStack>
  );
}
