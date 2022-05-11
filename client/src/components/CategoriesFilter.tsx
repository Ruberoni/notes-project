import React, { ReactElement } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverProps,
  Button,
  useCheckboxGroup,
  Center,
} from "@chakra-ui/react";
import { ICategory } from "../types";
import CategoryTag from "./CategoryTag";
import { useNoteContext } from "../context";

export interface CategoriesFilterProps extends Omit<PopoverProps, "filter"> {
  filter: string[];
  triggerButton?: ReactElement;
  setFilter: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function CategoriesFilter({
  triggerButton,
  filter,
  setFilter,
  ...props
}: CategoriesFilterProps): React.ReactElement {
  const { userCategories } = useNoteContext();

  const { getCheckboxProps } = useCheckboxGroup({
    value: filter,
    onChange: (filter) => setFilter(filter as string[]),
  });

  const SelectableCategory = (cat: ICategory): React.ReactElement => {
    const { isChecked, onChange } = getCheckboxProps({ value: cat.id });
    return (
      <Center
        as="button"
        w="100%"
        py="3px"
        px="7px"
        bg={isChecked ? "#FFD66D" : "white"}
        onClick={() => onChange(cat.id)}
      >
        <CategoryTag {...cat} />
      </Center>
    );
  };

  return (
    <Popover {...props}>
      <PopoverTrigger>
        {triggerButton ? React.cloneElement(triggerButton, { disabled: Boolean(!userCategories?.[0]) }) : (
          <Button
            disabled={Boolean(!userCategories?.[0])}
            colorScheme="blue"
            size="sm"
          >
            Filter
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverBody p="2px 3px">
          <>
            <Button
              mb="2px"
              size="sm"
              w="100%"
              colorScheme="red"
              disabled={Boolean(!filter[0])}
              onClick={() => setFilter([])}
            >
              Clear all
            </Button>
            {userCategories.map((cat) => {
              return <SelectableCategory key={cat.id} {...cat} />;
            })}
          </>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
