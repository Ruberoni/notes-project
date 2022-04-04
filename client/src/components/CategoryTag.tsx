import React, { ReactElement } from "react";
import {
  Tag,
  TagLabel,
  TagProps,
  TagRightIcon,
  TagCloseButton,
  TagCloseButtonProps,
  Skeleton,
  SkeletonProps,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

export interface CategoryTagProps extends TagProps {
  id?: string;
  color?: string;
  size?: string;
  label?: string;
}

export default function CategoryTag({
  color,
  label,
  ...props
}: CategoryTagProps): JSX.Element {
  return (
    <Tag
      size={"sm"}
      colorScheme={color?.toLocaleLowerCase() || "messenger"}
      {...props}
    >
      <TagLabel>{label || "Label"}</TagLabel>
      {props.children}
    </Tag>
  );
}

export interface RemovableCategoryTagProps extends CategoryTagProps {
  onRemove?: (id: string) => void;
  closeProps?: TagCloseButtonProps;
}

export function RemovableCategoryTag({
  onRemove,
  closeProps,
  ...props
}: RemovableCategoryTagProps): ReactElement {
  const _onRemove = () => {
    props.id && onRemove?.(props.id);
  };
  return (
    <CategoryTag {...props}>
      <TagCloseButton onClick={_onRemove} {...closeProps}></TagCloseButton>
    </CategoryTag>
  );
}

export interface AddCategoryTagProps extends CategoryTagProps {
  onAdd?: () => void
}

export function AddCategoryTag({onAdd, ...props}: AddCategoryTagProps): ReactElement {
  return (
    <CategoryTag bg="red.200" label="Add" {...props}>
      <button onClick={onAdd}>
        <TagRightIcon as={AddIcon} />
      </button>
      {/* <IconButton aria-label="Search database" icon={<AddIcon />} /> */}
    </CategoryTag>
  );
}

export function CategoryTagSkeleton(skeletonProps: SkeletonProps): ReactElement {
  return <Skeleton h="1.2rem" w="3rem" borderRadius={5} {...skeletonProps}/>
}