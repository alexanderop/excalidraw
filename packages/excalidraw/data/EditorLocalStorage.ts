import type { EDITOR_LS_KEYS } from "@excalidraw/common";

import type { JSONValue } from "../types";

export const EditorLocalStorage = {
  has(key: typeof EDITOR_LS_KEYS[keyof typeof EDITOR_LS_KEYS]) {
    try {
      return !!globalThis.localStorage.getItem(key);
    } catch (error: any) {
      console.warn(`localStorage.getItem error: ${error.message}`);
      return false;
    }
  },

  get<T extends JSONValue>(
    key: typeof EDITOR_LS_KEYS[keyof typeof EDITOR_LS_KEYS],
  ) {
    try {
      const value = globalThis.localStorage.getItem(key);
      if (value) {
        return JSON.parse(value) as T;
      }
      return null;
    } catch (error: any) {
      console.warn(`localStorage.getItem error: ${error.message}`);
      return null;
    }
  },

  set : (
    key: typeof EDITOR_LS_KEYS[keyof typeof EDITOR_LS_KEYS],
    value: JSONValue,
  ) => {
    try {
      globalThis.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error: any) {
      console.warn(`localStorage.setItem error: ${error.message}`);
      return false;
    }
  },

  delete : (
    name: typeof EDITOR_LS_KEYS[keyof typeof EDITOR_LS_KEYS],
  ) => {
    try {
      globalThis.localStorage.removeItem(name);
    } catch (error: any) {
      console.warn(`localStorage.removeItem error: ${error.message}`);
    }
  },
};
