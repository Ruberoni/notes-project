import { CSSObject } from "@chakra-ui/react";

/**
 * Hides the scrollbar 'x', 'y' or both
 */
export function getHideScrollBarCSS(scroll?: "x" | "y"): CSSObject {
  const sufix = scroll ? "-" + scroll : "";
  return {
    ".delHScrollBar": {
      ["overflow" + sufix]: "auto",
      "scrollbar-width": "none" /* Firefox */,
      "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
    },
    ".delHScrollBar::-webkit-scrollbar": {
      width: 0,
      height: 0,
    },
  };
}
