 
import {
  
  createStore,
  
  
} from "jotai";
import { createIsolation } from "jotai-scope";

const jotai = createIsolation();


export const { useAtom, useSetAtom, useAtomValue, useStore } = jotai;
export const EditorJotaiProvider: ReturnType<
  typeof createIsolation
>["Provider"] = jotai.Provider;

export const editorJotaiStore: ReturnType<typeof createStore> = createStore();

export {atom, type PrimitiveAtom, type WritableAtom} from "jotai";