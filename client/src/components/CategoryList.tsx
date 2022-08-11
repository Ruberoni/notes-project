import React, { memo, ReactElement, useCallback, useMemo, useState } from "react";
import {
  MenuItem,
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverCloseButton,
  HStack,
  VStack,
  Input,
  FormLabel,
  FormControl,
  Select,
  PopoverProps,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, CheckIcon } from "@chakra-ui/icons";
import CategoryTag, { CategoryTagProps } from "./CategoryTag";
import { ICategory } from "../types";
import { useNoteContext, useAppContext } from "../context";
import { useAddCategoryNoteMutation } from "../api/notes";
import { useDeleteCategoryMutation, useCreateCategoryMutation } from "../api/categories";
import { useUserCategoriesQuery } from "../api/user";
import { useAppShortcuts, SHORTCUTS } from '../hooks'

export interface CategoryListProps extends Omit<PopoverProps, "children"> {
  categories?: ICategory[];
  TriggerButton?: ReactElement; 
}

export default function CategoryList({TriggerButton, ...props}: CategoryListProps): ReactElement {
  const { currentNoteData, updateCurrentNote, userCategories } = useNoteContext();
  if (!currentNoteData) return <></>;

  const { isOpen, onToggle, onClose } = useDisclosure()

  const [addCategoryNote] = useAddCategoryNoteMutation();

  const handleAddCategoryNote = useCallback((cat: ICategory) => {
    addCategoryNote({
      variables: {
        categoryId: cat.id,
        noteId: currentNoteData.id,
      },
    });

    updateCurrentNote({
      categories: [...currentNoteData.categories, cat],
    });
  }, [addCategoryNote, currentNoteData.categories, currentNoteData.id, updateCurrentNote]);

  const areSameCategories = (cat1: ICategory, cat2: ICategory) => {
    if (cat1.id === cat2.id) return true;
    return false;
  };

  const includesCategory = (cat: ICategory, catList: ICategory[]) => {
    return catList.some((cat1) => areSameCategories(cat, cat1));
  };

  // userCategories less its notes categories
  const availableCategories = useMemo(() => userCategories.filter(
    (cat) => !includesCategory(cat, currentNoteData?.categories)
  ), [currentNoteData?.categories, userCategories]);

  useAppShortcuts(SHORTCUTS.ADD_CATEGORY_NOTE, () => {
    onToggle()
  },
  {
    preventDefault: true,
  })

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      closeOnBlur={false}
      {...props}
    >
      <PopoverTrigger>
        {TriggerButton ? React.cloneElement(TriggerButton, { onClick: onToggle }) : <Button onClick={onToggle}>Open</Button>}
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          w="fit-content"
          sx={{ gap: 2 }}
          p={0}
        >
          <CategoryListBodyMemo
            categories={availableCategories}
            onAddCategoryNote={handleAddCategoryNote}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const CategoryListBody = ({ categories, onAddCategoryNote }: {categories: ICategory[], onAddCategoryNote: (cat: ICategory) => void}) => {
  return (
    <>
      {categories.map((cat) => {
        const onClick = () => {
          onAddCategoryNote(cat);
        };
        return (
          <Button
            bg="none"
            p="5px 13px"
            w="100%"
            h="auto"
            key={cat.id}
            onClick={onClick}
          >
            <CategoryTag w="fit-content" {...cat} />
          </Button>
        );
      })}
    </>
  );
};

const CategoryListBodyMemo = memo(CategoryListBody)

export function CategoryItem(props: CategoryTagProps): ReactElement {
  return (
    <MenuItem>
      <CategoryTag {...props} />
    </MenuItem>
  );
}

export interface UserCategoryListProps extends Omit<PopoverProps, "children">{
  triggerButton?: ReactElement;
}

export function UserCategoryList(
  props: UserCategoryListProps
): ReactElement {

  const { state } = useAppContext();
  const { userCategories, setUserCategories } = useNoteContext()
  const userCategoriesQuery = useUserCategoriesQuery(state.userId as string, { skip: true })

  const [deleteCategory] = useDeleteCategoryMutation();
  
  const handleDeleteCategory = useCallback((cat: ICategory) => {
    setUserCategories(prev => prev.filter(_cat => cat.id !== _cat.id))
    deleteCategory({
      variables: {
        id: cat.id,
      },
    })
  }, [deleteCategory, setUserCategories]);

  return (
    <Popover {...props}>
      <PopoverTrigger>
        {props.triggerButton ? (
          React.cloneElement(props.triggerButton, {
            disabled: !state.userId || userCategoriesQuery.loading,
            isLoading: userCategoriesQuery.loading,
          })
        ) : (
          <Button
            colorScheme="blue"
            size="sm"
            disabled={!state.userId || userCategoriesQuery.loading}
            isLoading={userCategoriesQuery.loading}
          >
            Categories
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody>
          <UserCategoriesListBodyMemo
            categories={userCategories}
            onDeleteCategory={handleDeleteCategory}
          />
        </PopoverBody>
        <CreateCategoryPopover
          trigger={
            <PopoverFooter>
              <Button colorScheme="green" w="100%" leftIcon={<AddIcon />}>
                Create
              </Button>
            </PopoverFooter>
          }
        />
      </PopoverContent>
    </Popover>
  );
}

const UserCategoriesListBody = ({
  categories,
  onDeleteCategory,
}: {
  categories: ICategory[];
  onDeleteCategory: (cat: ICategory) => void;
}) => {

  return (
    <>
      {categories.map((cat) => {
        const _handleDeleteCategory = () => onDeleteCategory(cat);
        return (
          <HStack key={cat.id}>
            <CategoryTag mr="auto" {...cat} />
            <IconButton
              onClick={_handleDeleteCategory}
              aria-label="Delete category"
              variant="unstyled"
              icon={<DeleteIcon />}
            />
          </HStack>
        );
      })}
    </>
  );
};

const UserCategoriesListBodyMemo = memo(UserCategoriesListBody)

export const UserCategoryListMemo = memo(UserCategoryList)

export function CreateCategoryPopover({
  trigger,
}: {
  trigger: React.ReactNode;
}): ReactElement {

  const colorOptions = [
    { value: "RED", name: "Red" },
    { value: "BLUE", name: "Blue" },
    { value: "GREEN", name: "Green" },
    { value: "BLACK", name: "Black" },
    { value: "GRAY", name: "Gray" },
    { value: "PURPLE", name: "Purple" },
    { value: "ORANGE", name: "Orange" },
    { value: "DARKBLUE", name: "Darkblue" },
    { value: "DARKRED", name: "Darkred" },
  ];
  
  const [formValues, setFormValues] = useState({
    label: "",
    color: "",
  });

  const handleValueChange = (event: React.BaseSyntheticEvent) => {
    setFormValues({ ...formValues, [event?.target.name]: event?.target.value });
  };

  const { state } = useAppContext();
  const { getUserCategories } = useNoteContext()
  const [createCategory, { loading }] = useCreateCategoryMutation({
    onCompleted: () => {
      getUserCategories()
    }
  });

  const handleSubmit = () => {
    createCategory({
      variables: {
        userId: state.userId as string,
        content: formValues,
      },
    })
  }

  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent w="auto">
      <PopoverHeader>Create a category</PopoverHeader>
        <PopoverBody>
          <PopoverCloseButton />
          <VStack>
            <FormControl onChange={handleValueChange} id="label">
              <FormLabel>Label:</FormLabel>
              <Input name="label" type="text" />
            </FormControl>
            <Select
              name="color"
              mt=""
              placeholder="Color"
              onChange={handleValueChange}
            >
              {colorOptions.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.name}
                </option>
              ))}
            </Select>
          </VStack>
        </PopoverBody>
        <PopoverFooter>
          <IconButton
            onClick={handleSubmit}
            aria-label="Submit"
            variant="solid"
            colorScheme="green"
            icon={<CheckIcon />}
            w="100%"
            isLoading={loading}
          />
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}