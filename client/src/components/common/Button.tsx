import React from "react";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  CSSObject,
  useColorModeValue,
} from "@chakra-ui/react";

export interface ButtonProps extends ChakraButtonProps {
  isActive?: boolean;
}

const Button = (
  {
    children,
    isActive,
    ...buttonProps
  }: ButtonProps,
  ref: React.LegacyRef<HTMLButtonElement>
) => {
  const color = useColorModeValue("#143A51", 'text')

  const defaultStyle: CSSObject = {
    bg: 'transparent',
    color,
    borderColor: color
  }

  const activeStyles = {
    color: useColorModeValue("white", '#143A51'),
    bg: useColorModeValue("#143A51", 'text')
  }

  return (
    <ChakraButton
      ref={ref}
      h="auto"
      p="5px"
      m={0}
      borderRadius="50%"
      borderWidth={1}
      fontSize="sm"
      {...buttonProps}
      minW={buttonProps.w || 'unset'}
      _hover={!buttonProps.disabled
        ? {
        opacity: 0.8,
        ...buttonProps._hover
      } : undefined}
      _active={{...(isActive ? defaultStyle : activeStyles), ...buttonProps._active}}
      sx={{...defaultStyle, ...(isActive && activeStyles), ...buttonProps.sx}}
    >
      {children}
    </ChakraButton>
  );
};

export default React.forwardRef(Button);

