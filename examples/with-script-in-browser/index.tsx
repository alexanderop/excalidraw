import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@excalidraw/excalidraw/index.css";

import type * as TExcalidraw from "@excalidraw/excalidraw";

import App from "./components/ExampleApp";

declare global {
  interface Window {
    ExcalidrawLib: typeof TExcalidraw;
  }
}

const rootElement = document.querySelector("#root")!;
const root = createRoot(rootElement);
const { Excalidraw } = globalThis.ExcalidrawLib;
root.render(
  <StrictMode>
    <App
      appTitle={"Excalidraw Example"}
      useCustom={(api: any, args?: any[]) => {}}
      excalidrawLib={globalThis.ExcalidrawLib}
    >
      <Excalidraw />
    </App>
  </StrictMode>,
);
