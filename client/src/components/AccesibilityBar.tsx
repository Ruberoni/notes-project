import React from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Flex,
  Spacer,
  FlexProps,
  IconButtonProps,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";

export default function NotesAccesibilityBar(props: any): JSX.Element {
  const rightIcon: IconButtonProps = {
    icon: <AddIcon />,
    "aria-label": "Create a note",
  };
  return (
    <AccesibilityBar rightIcon={rightIcon}>
      <InputGroup maxWidth="200px" size="sm">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.900" />
        </InputLeftElement>
        <Input placeholder="Search by title..." />
      </InputGroup>
      <InputGroup maxWidth="200px" size="sm">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.900" />
        </InputLeftElement>
        <Input placeholder="Search by title..." />
      </InputGroup>
    </AccesibilityBar>
  );
}

export interface AccesibilityBarProps {
  leftIcon?: IconButtonProps;
  rightIcon?: IconButtonProps;
  children?: JSX.Element | JSX.Element[];
  childrenProps?: FlexProps;
  props?: any;
}

/**
 * Creates a horizontal bar highly customizable.
 * By default the children are in a Flex with justifyContent="space-evenly"
 * @param {IconButtonProps} leftIcon *Optional* An object with the props for the left IconButton
 * @param {IconButtonProps} rightIcon *Optional* An object with the props for the right IconButton
 * @param {FlexProps} childrenProps *Optional* An object with the props for the Flex wrapping the children.
 * @param children *Optional*
 * @returns
 */
export function AccesibilityBar({
  leftIcon,
  rightIcon,
  children,
  childrenProps,
  ...props
}: AccesibilityBarProps): JSX.Element {
  return (
    <HStack h="41px" bg="red.100" {...props}>
      {leftIcon && (
        <>
          <IconButton
            rounded="none"
            bg="#76C9E3"
            h="inherit"
            arialabel="sample"
            {...leftIcon}
          />
          <Spacer />
        </>
      )}
      <Flex
        w="100%"
        alignItems="center"
        justifyContent="space-evenly"
        bg="gray.100"
        {...childrenProps}
      >
        {children || "Use 'children' to insert here any element."}
      </Flex>
      {rightIcon && (
        <>
          <Spacer />
          <IconButton
            rounded="none"
            bg="#76C9E3"
            h="inherit"
            arialabel="sample"
            {...rightIcon}
          />
        </>
      )}
    </HStack>
  );
}
