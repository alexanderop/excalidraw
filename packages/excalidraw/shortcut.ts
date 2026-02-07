import { isDarwin } from "@excalidraw/common";

import { t } from "./i18n";

export const getShortcutKey = (shortcut: string): string =>
  shortcut
    .replace(
      /\b(opt(?:ion)?|alt)\b/i,
      isDarwin ? t("keys.option") : t("keys.alt"),
    )
    .replace(/\bshift\b/i, t("keys.shift"))
    .replace(/\b(enter|return)\b/i, t("keys.enter"))
    .replaceAll(
      /\b(ctrl|cmd|command|ctrlorcmd)\b/gi,
      isDarwin ? t("keys.cmd") : t("keys.ctrl"),
    )
    .replace(/\b(esc(?:ape)?)\b/i, t("keys.escape"))
    .replace(/\b(space(?:bar)?)\b/i, t("keys.spacebar"))
    .replace(/\b(del(?:ete)?)\b/i, t("keys.delete"));
