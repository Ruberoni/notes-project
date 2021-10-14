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
import { useMutation, useQuery } from "@apollo/client";
import CategoryTag, { CategoryTagProps } from "./CategoryTag";
import { ADD_CATEGORY_NOTE } from "../utils/queries";
import { ICategory } from "../types";
import { useNoteContext, useAppContext } from "../context";
import { categoriesList } from "../utils/seed";
import { CREATE_CATEGORY, DELETE_CATEGORY, GET_USER_CATEGORIES } from "../utils/queries";

export interface CategoryListProps extends Omit<MenuProps, "children"> {
  categories?: ICategory[];
  buttonAs?: ReactElement; //MenuButtonProps['as'];
}

export default function CategoryList(props: CategoryListProps): ReactElement {
  const { currentNote, updateCurrentNote } = useNoteContext();
  const { state } = useAppContext()
  if (!currentNote) return <></>;

  const getCategories = useQuery(GET_USER_CATEGORIES, {variables: {userId: state.userId} })
  console.log("[Popover][CategoryList][getCategories] data:", getCategories.data)
  const userCategories: ICategory[] = getCategories.data?.getUserCategories || [];

  const onAddCategoryNoteError = (error: any) => {
    console.log("[Component][CategoryList][addCategoryNote] error:", error);
  };
  const [addCategoryNote, res] = useMutation(ADD_CATEGORY_NOTE, {
    onError: onAddCategoryNoteError,
  });

  const handleAddCategoryNote = (cat: ICategory) => {
    console.log("[Popover][CategoryList] Adding category note");
    addCategoryNote({
      variables: {
        categoryId: cat.id,
        noteId: currentNote.id,
      },
    })
      .then((res) => {
        if (res.data !== undefined) {
          console.log(
            "[Popover][CategoryList] Sucessfully added category note"
          );
        }
      })
      .catch((error) => {
        console.log(
          "[Popover][CategoryList] Error adding category note:",
          error
        );
      });

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

  // userCategories less this notes categories
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

export function UserCategoryList(
  props: Omit<MenuProps, "children">
): ReactElement {

  const { state } = useAppContext();

  const getCategories = useQuery(GET_USER_CATEGORIES, {variables: {userId: state.userId} })
  console.log("[Popover][UserCategoryList][getCategories] data:", getCategories.data)
  const userCategories: ICategory[] = getCategories.data?.getUserCategories || [];

  const [deleteCategory, deleteCategoryRes] = useMutation(DELETE_CATEGORY);

  return (
    <Popover {...props}>
      <PopoverTrigger>
        <Button colorScheme="blue" size="sm">Categories</Button>
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody>
          {userCategories.map((cat) => {
            const onClick = () => {
              console.log("Category clicked with label:", cat.label);
            };
            const handleDeleteCategory = () => {
              console.log("[Popover][UserCategoryList] Deleting category");
              deleteCategory({
                variables: {
                  id: cat.id,
                },
              })
                .then(() => {
                  console.log(
                    "[Popover][UserCategoryList] Sucessfully deleted category"
                  );
                })
                .catch((error) => {
                  console.log(
                    "[Popover][UserCategoryList] Error deleting category:",
                    error
                  );
                });
            };
            return (
              <HStack key={cat.id} onClick={onClick}>
                <CategoryTag mr="auto" {...cat} />
                <IconButton
                  onClick={handleDeleteCategory}
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
            <PopoverFooter
            // as={HStack}
            // bg="green.200"
            // sx={{ cursor: "pointer" }}
            >
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
  const [createCategory, createCategoryRes] = useMutation(CREATE_CATEGORY);

  const handleSubmit = () => {
    console.log("[Popover][CreateCategoryPopover] Creating category");
    createCategory({
      variables: {
        userId: state.userId,
        content: formValues,
      },
    })
      .then(() => {
        console.log(
          "[Popover][CreateCategoryPopover] Sucessfully created category"
        );
      })
      .catch((error) => {
        console.log(
          "[Popover][CreateCategoryPopover] Error creating category:",
          error
        );
      });
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
