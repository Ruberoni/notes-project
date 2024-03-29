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
  breakpoints: {
    base: '0em',
    sm: '43em',
  },
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
    border: 'var(--border)',
    topbar: 'var(--topbar-background)',
  },
  styles: {
    global: ({ colorMode }) => ({
      ':root': {
        '--primary': colorMode === 'dark' ? '#131720' : '#FFD66D',
        '--text': colorMode === 'dark' ? '#E7F3F8' : 'black',
        '--border': colorMode === 'dark' ? '#142f42' : '#e5e5e5',
        '--topbar-background': colorMode === 'dark' ? '#131720' : '#FFD66D',
      },
      body: {
        color: 'text',
        bg: colorMode === 'dark' ? '#0b1924' : 'white',
      },
      '::-webkit-scrollbar': {
        width: '8px'
      },
      
      '::-webkit-scrollbar-track': {
        bg: 'transparent'
      },      
      '::-webkit-scrollbar-thumb': {
        bg: colorMode === 'dark' ? '#102333' : '#cdcdcd',
        borderRadius: '10px'
      },
      '::-webkit-scrollbar-thumb:hover': {
        bg: colorMode === 'dark' ? '#193851' : '#b9b9b9',
      },
      '.editorToolBar': {
        '& button[disabled]': {
          background: colorMode === 'dark' ? 'gray' : '#bfbfbf',
        },
        '& div': {
          zIndex: '1'
        }
      },
      '.toolBarConfig': {
        background: 'linear-gradient(61deg, rgb(253, 253, 253) 0px, rgb(246, 247, 248))'
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
    }),
  },
});
