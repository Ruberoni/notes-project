import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  useSystemColorMode: true,
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
  colors: {
    text: {
      main: 'black',
      dark: '#E7F3F8',
    },
    border: {
      main: '#c0c0c0',
      dark: '#142f42',
      smooth: '#e5e5e5'
    }
  },
  styles: {
    global: ({ colorMode }) => ({
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
      },
      body: {
        color: colorMode === 'dark' ? 'text.dark' : 'text.main',
        bg: colorMode === 'dark' ? '#0b1924' : 'white',
      }
      
    }),
  },
});
