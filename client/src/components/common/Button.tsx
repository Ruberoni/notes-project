import React from "react";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";

export interface ButtonProps extends ChakraButtonProps {
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
  invertColors?: boolean;
}

const Button = (
  {
    children,
    primaryColor = "#143A51",
    secondaryColor = "white",
    invertColors,
    isActive,
    ...buttonProps
  }: ButtonProps,
  ref: React.LegacyRef<HTMLButtonElement>
) => {
  if (invertColors) {
    const tempColor = primaryColor;
    primaryColor = secondaryColor;
    secondaryColor = tempColor;
  }

  return (
    <ChakraButton
      ref={ref}
      bg={isActive ? primaryColor : secondaryColor}
      borderRadius="50%"
      h="auto"
      p="5px"
      m={0}
      minW="unset"
      color={isActive ? secondaryColor : primaryColor}
      borderColor={primaryColor}
      borderWidth={1}
      fontSize="sm"
      _hover={{
        borderColor: "#2B4D62",
        color: "#2B4D62",
      }}
      _active={{
        backgroundColor: primaryColor,
        color: secondaryColor,
      }}
      {...buttonProps}
    >
      {children}
    </ChakraButton>
  );
};

export default React.forwardRef(Button);
