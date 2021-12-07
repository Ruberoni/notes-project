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
  Spacer,
} from "@chakra-ui/react";
import { Link as RLink } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import { useAppContext } from "../context";
import { customUseGoogleLogout } from "../hooks";
import AboutModal from "./about/AboutModal";

export function TopBar(props: BoxProps): JSX.Element {
  const currentBreakpoint = useBreakpoint();
  const apolloClient = useApolloClient()

  const context = useAppContext();
  const isLoggedIn = Boolean(context.state.userId);

  const LoggedOutWelcomeText = "Welcome, please login or register.";
  const LoggedInWelcomeText = `Welcome ${context.state.userName}`;

  const [error, { signOut }] = customUseGoogleLogout();
  if (error) return error;

  const handleLogout = async () => {
    await apolloClient.clearStore()
    signOut?.()
  }

  const LoggedOutButtons = (
    <>
      <Link
        as={RLink}
        to="/login"
        mr="2"
        fontWeight="bold"
        _hover={{ textDecoration: "none" }}
      >
        LOGIN
      </Link>
      <Link
        as={RLink}
        to="/register"
        mr="2"
        fontWeight="bold"
        _hover={{ textDecoration: "none" }}
      >
        REGISTER
      </Link>
    </>
  );

  const LoggedInButton = (
    <>
      <Button bg="trasparent" h="inherit" onClick={handleLogout}>
        LOGOUT
      </Button>
    </>
  );

  return (
    <Box w="100%" h="26px" bg="#FFD66D" {...props}>
      {currentBreakpoint !== "base" && (
        <Flex justify="center">
          <Text bg="" textAlign="center" size="lg">
            {isLoggedIn ? LoggedInWelcomeText : LoggedOutWelcomeText}
          </Text> 
        </Flex>
      )}
      <Flex h="inherit" position="absolute" left="0" top="0" right="0" bottom="0">
        {currentBreakpoint !== "base" && (
          <Heading as={RLink} to="/" bg="" size="md" pl="2%">
            Notes Project
          </Heading>
        )}
        <Spacer />
        <Box textAlign="right" bg="" pr="2%" h={25}>
          {isLoggedIn ? LoggedInButton : LoggedOutButtons}
        </Box>
      </Flex>
    </Box>
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
