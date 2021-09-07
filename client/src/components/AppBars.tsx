import React from "react";
import { Text, Box, Button, Heading, Grid } from "@chakra-ui/react";

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
      <Button bg="trasparent" mr="2" h="inherit">
        LOGIN
      </Button>
      <Button bg="trasparent" h="inherit">
        REGISTER
      </Button>
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
      <Heading bg="" size="md" pl="2%">
        Notes Project
      </Heading>
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
