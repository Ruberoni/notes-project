import React from "react";
import {
  Text,
  Box,
  BoxProps,
  Button,
  Heading,
  Link,
  useBreakpoint,
  Flex,
  FlexProps,
  ButtonProps,
} from "@chakra-ui/react";
import { Link as RLink,  } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useAppContext } from "../context";

import AboutModal from "./about/AboutModal";

export function TopBar(props: BoxProps): JSX.Element {
  const currentBreakpoint = useBreakpoint();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const context = useAppContext();

  return (
    <Flex
      w="100%"
      h="40px"
      bg="#FFD66D"
      borderBottom='1px solid #c0c0c0'
      padding="0 2%"
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      {currentBreakpoint !== "base" && (
        <Heading as={RLink} to="/" bg="" size="md">
          Notes Project
        </Heading>
      )}
      {isAuthenticated ? (
        <TextButton ml='auto' onClick={context.auth.logout}>LOGOUT</TextButton>
      ) : (
        <TextButton ml='auto' onClick={loginWithRedirect}>LOGIN</TextButton>
      )}
    </Flex>
  );
}

export function BottomBar(props: FlexProps): JSX.Element {
  return (
    <Flex
      bg="#A8201A"
      h="24px"
      color="white"
      justify="space-between"
      {...props}
    >
      <Flex w="-webkit-fill-available">
        <Text bg="" alignSelf="center" textAlign="center" pl="2%">
          Made by <Link href='https://github.com/Ruberoni/' isExternal>Ruben</Link> (c) 2021
        </Text>
      </Flex>
      <AboutModal mr="2%" modalBodyProps={{ fontSize: "lg" }} />
    </Flex>
  );
}

export const TextButton = ({ children, ...buttonProps }: ButtonProps) => (
  <Button
    bg="trasparent"
    alignItems="flex-start"
    flexDirection="column"
    {...buttonProps}
    _hover={{
      "& > .textButtonLine": {
        width: "100%",
      },
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