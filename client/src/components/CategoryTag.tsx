import React from "react";
import { Tag, TagLabel } from "@chakra-ui/react";

export interface CategoryTagProps {
  id?: string;
  color?: string;
  size?: string;
  label?: string;
  [key: string]: any;
}

export default function CategoryTag({
  id,
  color,
  label,
  props
}: CategoryTagProps): JSX.Element {
  return (
    <Tag size={"sm"} colorScheme={color || "messenger"} {...props}>
      <TagLabel>{label || "Label"}</TagLabel>
    </Tag>
  );
}
