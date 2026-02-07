import { arrayToMapWithIndex } from "@excalidraw/common";

import type { ExcalidrawElement } from "./types";

const normalizeGroupElementOrder = (elements: readonly ExcalidrawElement[]) => {
  const origElements: ExcalidrawElement[] = [...elements];
  const sortedElements = new Set<ExcalidrawElement>();

  const orderInnerGroups = (
    elements: readonly ExcalidrawElement[],
  ): ExcalidrawElement[] => {
    const firstGroupSig = elements[0]?.groupIds?.join("");
    const aGroup: ExcalidrawElement[] = [elements[0]];
    const bGroup: ExcalidrawElement[] = [];
    for (const element of elements.slice(1)) {
      if (element.groupIds?.join("") === firstGroupSig) {
        aGroup.push(element);
      } else {
        bGroup.push(element);
      }
    }
    return bGroup.length > 0 ? [...aGroup, ...orderInnerGroups(bGroup)] : aGroup;
  };

  const groupHandledElements = new Map<string, true>();

  for (const [idx, element] of origElements.entries()) {
    if (groupHandledElements.has(element.id)) {
      continue;
    }
    if (element.groupIds?.length) {
      const topGroup = element.groupIds.at(-1);
      const groupElements = origElements.slice(idx).filter((element) => {
        const ret = element?.groupIds?.includes(topGroup);
        if (ret) {
          groupHandledElements.set(element!.id, true);
        }
        return ret;
      });

      for (const elem of orderInnerGroups(groupElements)) {
        sortedElements.add(elem);
      }
    } else {
      sortedElements.add(element);
    }
  }

  // if there's a bug which resulted in losing some of the elements, return
  // original instead as that's better than losing data
  if (sortedElements.size !== elements.length) {
    console.error("normalizeGroupElementOrder: lost some elements... bailing!");
    return elements;
  }

  return [...sortedElements];
};

/**
 * In theory, when we have text elements bound to a container, they
 * should be right after the container element in the elements array.
 * However, this is not guaranteed due to old and potential future bugs.
 *
 * This function sorts containers and their bound texts together. It prefers
 * original z-index of container (i.e. it moves bound text elements after
 * containers).
 */
const normalizeBoundElementsOrder = (
  elements: readonly ExcalidrawElement[],
) => {
  const elementsMap = arrayToMapWithIndex(elements);

  const origElements: (ExcalidrawElement | null)[] = [...elements];
  const sortedElements = new Set<ExcalidrawElement>();

  for (const [idx, element] of origElements.entries()) {
    if (!element) {
      continue;
    }
    if (element.boundElements?.length) {
      sortedElements.add(element);
      origElements[idx] = null;
      for (const boundElement of element.boundElements) {
        const child = elementsMap.get(boundElement.id);
        if (child && boundElement.type === "text") {
          sortedElements.add(child[0]);
          origElements[child[1]] = null;
        }
      }
    } else if (element.type === "text" && element.containerId) {
      const parent = elementsMap.get(element.containerId);
      if (!parent?.[0].boundElements?.find((x) => x.id === element.id)) {
        sortedElements.add(element);
        origElements[idx] = null;

        // if element has a container and container lists it, skip this element
        // as it'll be taken care of by the container
      }
    } else {
      sortedElements.add(element);
      origElements[idx] = null;
    }
  }

  // if there's a bug which resulted in losing some of the elements, return
  // original instead as that's better than losing data
  if (sortedElements.size !== elements.length) {
    console.error(
      "normalizeBoundElementsOrder: lost some elements... bailing!",
    );
    return elements;
  }

  return [...sortedElements];
};

export const normalizeElementOrder = (
  elements: readonly ExcalidrawElement[],
) => {
  return normalizeBoundElementsOrder(normalizeGroupElementOrder(elements));
};
