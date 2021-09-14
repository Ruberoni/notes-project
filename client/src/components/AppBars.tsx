import React from "react";
import { Text, Box, Button, Heading, Grid, Link } from "@chakra-ui/react";
import { Link as RLink } from "react-router-dom";

export function TopBar(): JSX.Element {
  const app = {
    user: {
      name: "Ruben",
    },
  };
  const isLoggedIn = false;

  const LoggetOutWelcomeText = "Welcome, please login or register.";
  const LoggedInWelcomeText = `Welcome ${app.user.name}`;

  const LoggetOutButtons = (
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
      <Button bg="trasparent" h="inherit">
        LOGOUT
      </Button>
    </>
  );

  return (
    <Grid h="26px" bg="#FFD66D" templateColumns="repeat(3, 1fr)">
      <div>
        <Heading as={RLink} to="/" bg="" size="md" pl="2%">
          Notes Project
        </Heading>
      </div>
      <Text bg="" textAlign="center" size="lg">
        {isLoggedIn ? LoggedInWelcomeText : LoggetOutWelcomeText}
      </Text>
      <Box textAlign="right" bg="" pr="1%" h={25}>
        {isLoggedIn ? LoggedInButton : LoggetOutButtons}
      </Box>
    </Grid>
  );
}

export function BottomBar(): JSX.Element {
  return (
    <Grid bg="#A8201A" h="26px" templateColumns="repeat(3, 1fr)" color="white">
      <Box bg=""></Box>
      <Text bg="" textAlign="center">
        Made by Ruben (c) 2021
      </Text>
      <Text bg="" textAlign="right" pr="2%">
        About
      </Text>
    </Grid>
  );
}
