import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  useSystemColorMode: true,
}

/**
 * Global styles
 * 
 * Issue related to charka ui color modes
 * https://github.com/chakra-ui/chakra-ui/issues/1162
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
    text: 'var(--text)',
    primary: 'var(--primary)',
    border: 'var(--border)'
  },
  styles: {
    global: ({ colorMode }) => ({
      ':root': {
        '--primary': colorMode === 'dark' ? '#131720' : '#FFD66D',
        '--text': colorMode === 'dark' ? '#E7F3F8' : 'black',
        '--border': colorMode === 'dark' ? '#142f42' : '#e5e5e5',
      },
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
        color: 'text',
        bg: colorMode === 'dark' ? '#0b1924' : 'white',
      },
      
    }),
  },
});
