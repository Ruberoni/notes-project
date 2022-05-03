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
import { Link as RLink,  } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useAppContext } from "../context";

import AboutModal from "./about/AboutModal";

export function TopBar(props: BoxProps): JSX.Element {
  const currentBreakpoint = useBreakpoint();
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const context = useAppContext();

  // const isLoggedIn = Boolean(context.state.userId);
  const isLoggedIn = isAuthenticated;

  const LoggedOutWelcomeText = "Welcome, please login or register.";
  const LoggedInWelcomeText = `Welcome ${user?.name || user?.email || ''}`;

  const LoggedOutButtons = (
    <>
      <Button
        // as={RLink}
        // to="/login"
        h="inherit"
        onClick={loginWithRedirect}
        mr="2"
        fontWeight="bold"
        _hover={{ textDecoration: "none" }}
      >
        LOGIN
      </Button>
    </>
  );

  const LoggedInButton = (
    <>
      <Button bg="trasparent" h="inherit" onClick={context.auth.logout}>
        LOGOUT
      </Button>
    </>
  );

  return (
    <Box w="100%" h="26px" bg="#FFD66D" color='black' {...props}>
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
