import React, { ReactElement } from "react";
import {
  Tag,
  TagLabel,
  TagProps,
  TagCloseButton,
  TagCloseButtonProps,
} from "@chakra-ui/react";

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
