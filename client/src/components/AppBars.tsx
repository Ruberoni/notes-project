import React from "react";
import {
  Text,
  Box,
  BoxProps,
  Button,
  Heading,
  Link,
  Flex,
  FlexProps,
  ButtonProps,
  ComponentWithAs,
  useColorModeValue
} from "@chakra-ui/react";
import { Link as RLink,  } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useAppContext } from "../context";

import AboutModal from "./about/AboutModal";

export function TopBar(props: BoxProps): JSX.Element {
  const bg = useColorModeValue('#FFD66D', '#131720');
  const borderColor = useColorModeValue('#c0c0c0', 'border');
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const context = useAppContext();

  return (
    <Flex
      w="100%"
      h="40px"
      bg={bg}
      borderBottom='1px solid'
      borderColor={borderColor}
      padding="0 2vw"
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      {!context.state.isMobile && (
        <Heading as={RLink} to="/" bg="" size="md">
          Notes Project
        </Heading>
      )}
      {isAuthenticated ? (
        <TextButton ml='auto' color='text' onClick={context.auth.logout}>LOGOUT</TextButton>
      ) : (
        <TextButton ml='auto' color='text' onClick={loginWithRedirect}>LOGIN</TextButton>
      )}
    </Flex>
  );
}

export function BottomBar(props: FlexProps): JSX.Element {
  const bg = useColorModeValue('#143A51', '#131720');

  return (
    <Flex
      bg={bg}
      h="2.5em"
      color="white"
      justify="space-between"
      p="0 2vw"
      {...props}
    >
      <Flex alignItems="center" fontSize="0.8em">
        <Text bg="" textAlign="center" >
          Made by
        </Text>
        <TextButton
          as={Link}
          color="white"
          p={0}
          ml={1}
          top='0.45px'
          h="inherit"
          fontWeight="normal"
          href="https://github.com/Ruberoni/"
          _hover={{ textDecoration: "none" }}
          isExternal
        >
          Ruben
        </TextButton>
        <Text bg="" textAlign="center" >
          (c) 2021
        </Text>
      </Flex>
      <AboutModal
        triggerButton={
          <TextButton h="inherit" fontWeight="normal" color="white">
            About
          </TextButton>
        }
      />
    </Flex>
  );
}

export const TextButton: ComponentWithAs<"button", ButtonProps> = ({
  children,
  ...buttonProps
}: ButtonProps) => (
  <Button
    bg="trasparent"
    alignItems="flex-start"
    flexDirection="column"
    {...buttonProps}
    fontSize={buttonProps.fontSize || 'inherit'}
    _hover={{
      "& > .textButtonLine": {
        width: "100%",
      },

      ...buttonProps._hover,
    }}
  >
    {children}
    <Box
      className="textButtonLine"
      bg={buttonProps.color || "black"}
      h="1px"
      w="0%"
      transition="all 150ms ease-out"
    />
  </Button>
);