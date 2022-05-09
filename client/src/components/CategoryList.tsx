import React, { ReactElement, useState } from "react";
import {
  Menu,
  MenuProps,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Link,
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
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon, CheckIcon } from "@chakra-ui/icons";
import CategoryTag, { CategoryTagProps } from "./CategoryTag";
import { ICategory } from "../types";
import { useNoteContext, useAppContext } from "../context";
import { useAddCategoryNoteMutation } from "../api/notes";
import { useDeleteCategoryMutation, useCreateCategoryMutation } from "../api/categories";
import { useUserCategoriesQuery } from "../api/user";

export interface CategoryListProps extends Omit<MenuProps, "children"> {
  categories?: ICategory[];
  buttonAs?: ReactElement; 
}

export default function CategoryList(props: CategoryListProps): ReactElement {
  const { currentNote, updateCurrentNote, userCategories } = useNoteContext();
  if (!currentNote) return <></>;
  const [addCategoryNote] = useAddCategoryNoteMutation()

  const handleAddCategoryNote = (cat: ICategory) => {
    addCategoryNote({
      variables: {
        categoryId: cat.id,
        noteId: currentNote.id,
      },
    })

    updateCurrentNote({
      ...currentNote,
      categories: [...currentNote.categories, cat],
    });
  };

  const areSameCategories = (cat1: ICategory, cat2: ICategory) => {
    if (cat1.id === cat2.id) return true;
    return false;
  };

  const includesCategory = (cat: ICategory, catList: ICategory[]) => {
    return catList.some((cat1) => areSameCategories(cat, cat1));
  };

  // userCategories less its notes categories
  const availableCategories = userCategories.filter(
    (cat) => !includesCategory(cat, currentNote?.categories)
  );

  return (
    <Menu {...props}>
      <MenuButton as={Link} h="3">
        {props.buttonAs}
      </MenuButton>
      <MenuList>
        {availableCategories.map((cat) => {
          const onClick = () => {
            handleAddCategoryNote(cat);
          };
          return (
            <MenuItem key={cat.id} onClick={onClick}>
              <CategoryTag {...cat} />
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

export function CategoryItem(props: CategoryTagProps): ReactElement {
  return (
    <MenuItem>
      <CategoryTag {...props} />
    </MenuItem>
  );
}

export interface UserCategoryListProps extends Omit<MenuProps, "children">{
  triggerButton?: ReactElement;
}

export function UserCategoryList(
  props: UserCategoryListProps
): ReactElement {

  const { state } = useAppContext();
  const { userCategories, setUserCategories } = useNoteContext()
  const userCategoriesQuery = useUserCategoriesQuery(state.userId as string, { skip: true })

  const [deleteCategory, ] = useDeleteCategoryMutation();
  
  const handleDeleteCategory = (cat: ICategory) => {
    setUserCategories(prev => prev.filter(_cat => cat.id !== _cat.id))
    deleteCategory({
      variables: {
        id: cat.id,
      },
    })
  };

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
          {userCategories.map((cat) => {
            const onClick = () => {
              console.log("Category clicked with label:", cat.label);
            };
            const _handleDeleteCategory = () => handleDeleteCategory(cat);
            return (
              <HStack key={cat.id} onClick={onClick}>
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
    console.log("[Popover][CreateCategoryPopover] formValues:", formValues);
    setFormValues({ ...formValues, [event?.target.name]: event?.target.value });
  };

  const { state } = useAppContext();
  const { getUserCategories } = useNoteContext()
  const [createCategory] = useCreateCategoryMutation({
    onCompleted: () => {
      getUserCategories()
    }
  });

  const handleSubmit = () => {
    console.log("[Popover][CreateCategoryPopover] Creating category");
    createCategory({
      variables: {
        userId: state.userId as string,
        content: formValues,
      },
    })
  };

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
          />
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
