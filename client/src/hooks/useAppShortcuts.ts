import { Options, useHotkeys } from "react-hotkeys-hook";
import { useAppContext } from "../context";

export const SHORTCUTS = {
  CREATE_NOTE: "ctrl+shift+c",
  FOCUS_SEARCH: "ctrl+k",
  FOCUS_NOTE_EDITOR: "ctrl+shift+e",
} as const;

type useHotKeysParameters = Parameters<typeof useHotkeys>

interface CustomOptions extends Options {
  preventDefault?: boolean
}

const useAppShortcuts = (
  key: typeof SHORTCUTS[keyof typeof SHORTCUTS],
  cb: useHotKeysParameters[1],
  options?: CustomOptions,
  deps?: useHotKeysParameters[3]
): ReturnType<typeof useHotkeys> => {

  const appContext = useAppContext();
  return useHotkeys(
    key,
    (kbEvent, hkEvents) => {
      if (options?.preventDefault) kbEvent.preventDefault()
      return cb(kbEvent, hkEvents)
    },
    {
      enabled: Boolean(appContext.state.userId),
      ...options
    },
    deps
  );
};

export default useAppShortcuts;
