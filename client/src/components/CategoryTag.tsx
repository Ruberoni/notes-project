import React from "react";
import { Tag, TagLabel } from "@chakra-ui/react";

interface CategoryTagProps {
  color?: string;
  size?: string;
  label?: string;
}

export default function CategoryTag({
  color,
  size,
  label,
}: CategoryTagProps): JSX.Element {
  return (
    <Tag size={size || "sm"} colorScheme={color || "messenger"}>
      <TagLabel>{label || "Label"}</TagLabel>
    </Tag>
  );
}
