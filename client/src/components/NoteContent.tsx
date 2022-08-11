import React, { ReactElement, useRef } from "react";
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
  useMediaQuery,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import ResizeTextarea from "react-textarea-autosize";
import RichTextEditor, { StyleConfigList, ToolbarConfig } from "react-rte";
import CategoryList from "./CategoryList";
import { RemovableCategoryTag, AddCategoryTagRef } from "./CategoryTag";
import { useNoteContent, INoteContentUtils, useAppShortcuts, SHORTCUTS } from "../hooks";
import { INote } from "../types";
import './NoteContent.css'

import Button from "./common/Button";

export interface NoteContentProps extends StackProps {
  body?: INote["body"];
  title?: INote["title"];
  categories?: INote["categories"];
}

function NoteContent(props: StackProps): ReactElement {
  const [
    note,
    loading,
    { content: contentUtils, header: headerUtils }
  ] = useNoteContent()
  const NoteContentEditorRef = useRef<RichTextEditor>(null)

  const editorCodeStyleBackground = useColorModeValue('rgb(243, 243, 243)', 'black')
  const [hasToolbarResized] = useMediaQuery('(max-width: 780px) and (min-width: 686px), (max-width: 545px)')

  useAppShortcuts(SHORTCUTS.DELETE_NOTE, () => {
    if (window.confirm("Do you really want to delete the note?")) {
      headerUtils.handleDeleteNote()
    }
  },
  {
    enabled: Boolean(note),
    preventDefault: true,
  },
  [note?.id])

  useAppShortcuts(SHORTCUTS.FOCUS_NOTE_EDITOR, () => {
    //@ts-expect-error Undocumented
    NoteContentEditorRef.current?._focus()
  })

  if (!note)
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
      <NoteContentHeader
        noteTitle={note.title}
        noteCategories={note.categories}
        utils={headerUtils}
      />
      <RichTextEditor
        ref={NoteContentEditorRef}
        value={note.body || RichTextEditor.createEmptyValue()}
        onChange={contentUtils.handleBodyChange}
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
          height: hasToolbarResized ? '96%' : '98%',
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

export default React.memo(NoteContent)

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

interface NoteContentHeader {
  noteTitle: INote['title'];
  noteCategories: INote['categories'];
  utils: INoteContentUtils['header'];
}

const NoteContentHeader = ({noteTitle, noteCategories, utils}: NoteContentHeader) => {
  return <Flex align="normal" w="inherit" pb={2}>
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
        value={noteTitle}
        onChange={utils.handleTitleChange}
        as={ResizeTextarea}
        border="0px" />
      <NoteContentCategoriesMemo categories={noteCategories} onCategoryRemove={utils.handleCategoryRemove} />
    </VStack>
    <Tooltip label={SHORTCUTS.DELETE_NOTE}>
      <Button
        w='30px'
        h='30px'
        alignSelf='center'
        m='0 calc(2vw + 16px) 0 1%'
        onClick={utils.handleDeleteNote}
        aria-label="Delete note"
      >
        <DeleteIcon />
      </Button>
    </Tooltip>
  </Flex>
}

const NoteCategoriesPopoverTrigger = React.forwardRef<HTMLButtonElement>(function NoteCategoriesPopoverTrigger(props, ref) {
  return <Tooltip label={SHORTCUTS.ADD_CATEGORY_NOTE}><AddCategoryTagRef {...props} ref={ref}/></Tooltip>
})

interface NoteContentCategoriesProps {
  categories?: INote['categories'];
  onCategoryRemove?: INoteContentUtils['header']['handleCategoryRemove']
}

const NoteContentCategories = ({
  categories,
  onCategoryRemove,
}: NoteContentCategoriesProps) => {

  return (
    <Wrap w="inherit" pl="10px">
      {categories?.map((category) => (
        <RemovableCategoryTag
          key={category.id}
          onRemove={onCategoryRemove}
          {...category}
        />
      ))}

      <CategoryList
        categories={categories || []}
        gutter={1}
        TriggerButton={<NoteCategoriesPopoverTrigger />}
      />
    </Wrap>
  );
};

const NoteContentCategoriesMemo = React.memo(NoteContentCategories)