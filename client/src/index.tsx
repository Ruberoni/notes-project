import React from "react";
import ReactDOM from "react-dom";

import { ChakraProvider, Box, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import "@fontsource/source-sans-pro";

import reportWebVitals from "./reportWebVitals";
import {
  ApolloProvider,
  theme,
  Routes,
  Auth0ProviderWithHistory,
} from "./config";
import { AppContextProvider } from "./context";

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Auth0ProviderWithHistory>
            <ApolloProvider>
              <AppContextProvider>
                <Box display="flex" h="100vh" flexDirection="column">
                  <Routes />
                </Box>
              </AppContextProvider>
            </ApolloProvider>
          </Auth0ProviderWithHistory>
        </BrowserRouter>
      </ChakraProvider>
    </React.StrictMode>
  </>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
