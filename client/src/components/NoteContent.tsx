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
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import ResizeTextarea from "react-textarea-autosize";
import RichTextEditor, { StyleConfigList, ToolbarConfig } from "react-rte";
import CategoryList from "./CategoryList";
import { RemovableCategoryTag, AddCategoryTagRef } from "./CategoryTag";
import { useNoteContent } from "../hooks";
import { INote } from "../types";
import './NoteContent.css'

import Button from "./common/Button";

export interface NoteContentProps extends StackProps {
  body?: INote["body"];
  title?: INote["title"];
  categories?: INote["categories"];
}

export default function NoteContent(props: StackProps): ReactElement {
  const [note, loading, utils] = useNoteContent();
  const editorCodeStyleBackground = useColorModeValue('rgb(243, 243, 243)', 'black')

  if (!note || !utils)
    return (
      <Center h="inherit" w="100%">
        <Heading
          textAlign="center"
          color="gray"
          opacity={0.2}
          size="4xl"
          userSelect="none"
        >
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
    <VStack h="100%" w="100%" spacing={0} {...props}>
      <Flex align="normal" w="inherit" pb={2}>
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
              triggerButton={<AddCategoryTagRef />}
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
        toolbarClassName="editorToolBar"
        rootStyle={{
          overflow: "hidden",
          width: "100%",
          height: "100%",
          borderBottom: 0,
          backgroundColor: "transparent",
          borderWidth: 0,
        }}
        editorStyle={{
          height: '98%',
          overflow: 'auto'
        }}
        toolbarStyle={{
          borderWidth: 0,
          color: 'black',
        }}
        toolbarConfig={toolbarConfig}
        customStyleMap={{
          'CODE': {
            background: editorCodeStyleBackground,
            fontFamily: 'Inconsolata, Menlo, Consolas, monospace',
            fontSize: '1em',
            padding: '2px 6px'
          }
        }}
      />
    </VStack>
  );
}

const INLINE_STYLE_BUTTONS: StyleConfigList = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Strikethrough", style: "STRIKETHROUGH" },
  { label: "Monospace", style: "CODE" },
  { label: "Underline", style: "UNDERLINE" },
];

// const BLOCK_ALIGNMENT_BUTTONS: StyleConfigList = [
//   { label: "Align Left", style: "ALIGN_LEFT" },
//   { label: "Align Center", style: "ALIGN_CENTER" },
//   { label: "Align Right", style: "ALIGN_RIGHT" },
//   { label: "Align Justify", style: "ALIGN_JUSTIFY" },
// ];

const BLOCK_TYPE_DROPDOWN: StyleConfigList = [
  { label: "Normal", style: "unstyled" },
  { label: "Heading Large", style: "header-one" },
  { label: "Heading Medium", style: "header-two" },
  { label: "Heading Small", style: "header-three" },
];
const BLOCK_TYPE_BUTTONS: StyleConfigList = [
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Blockquote", style: "blockquote" },
];

/**
 * I actually copy pasted the code of the official repo.
 * @link https://github.com/sstur/react-rte/blob/master/src/lib/EditorToolbarConfig.js
 */
 const toolbarConfig: ToolbarConfig = {
  display: [
    "INLINE_STYLE_BUTTONS",
    // "BLOCK_ALIGNMENT_BUTTONS",
    "BLOCK_TYPE_BUTTONS",
    "LINK_BUTTONS",
    "BLOCK_TYPE_DROPDOWN",
    "HISTORY_BUTTONS",
  ],
  INLINE_STYLE_BUTTONS,
  // BLOCK_ALIGNMENT_BUTTONS,
  BLOCK_TYPE_DROPDOWN,
  BLOCK_TYPE_BUTTONS,
  extraProps: {
    className: 'toolBarConfig'
  }
};
