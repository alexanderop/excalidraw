 
import {
  
  
  useAtom,
  
  
  createStore,
  type PrimitiveAtom,
} from "jotai";
import { useLayoutEffect } from "react";

export const appJotaiStore = createStore();



export const useAtomWithInitialValue = <
  T extends unknown,
  A extends PrimitiveAtom<T>,
>(
  atom: A,
  initialValue: T | (() => T),
) => {
  const [value, setValue] = useAtom(atom);

  useLayoutEffect(() => {
    if (typeof initialValue === "function") {
      // @ts-ignore
      setValue(initialValue());
    } else {
      setValue(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValue] as const;
};

export {atom, Provider, useAtomValue, useSetAtom, useAtom} from "jotai";