import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: 'light',
  // useSystemColorMode: false,
}

/**
 * Global styles
 */
export default extendTheme({
  config,
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
        "msOverflowStyle": "none" /* Internet Explorer 10+ */,
      },
      ".hideScrollBar::-webkit-scrollbar": {
        width: 0,
        height: 0,
      },
      h1: {
        fontSize: 32,
      },
      h2: {
        fontSize: 24,
      },
      h3: {
        fontSize: 18,
      }
    },
  },
});
