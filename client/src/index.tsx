import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/source-sans-pro";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const theme = extendTheme({
  fonts: {
    body: "Source Sans Pro",
  },
  components: {
    Tag: {
      defaultProps: {
        variant: "solid",
      },
    },
  },
  styles: {
    global: {
      // Styles to hide scrollbar
      ".hideScrollBar": {
        overflow: "auto",
        "scrollbar-width": "none" /* Firefox */,
        "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
      },
      ".hideScrollBar::-webkit-scrollbar": {
        width: 0,
        height: 0,
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
