import { useSyncExternalStore } from "react";

/** Widest first. Mirrors `sm` and `fold` in the theme. */
const BREAKPOINTS = [
  ["(min-width: 56.25rem)", 4],
  ["(min-width: 40rem)", 3],
] as const;
const BASE_COLUMNS = 2;

const subscribe = (onChange: () => void) => {
  const lists = BREAKPOINTS.map(([query]) => window.matchMedia(query));
  lists.forEach((list) => list.addEventListener("change", onChange));
  return () =>
    lists.forEach((list) => list.removeEventListener("change", onChange));
};

const getSnapshot = () =>
  BREAKPOINTS.find(([query]) => window.matchMedia(query).matches)?.[1] ??
  BASE_COLUMNS;

/** `null` on the server, where the viewport is unknown and CSS columns stand in. */
export const useColumnCount = () =>
  useSyncExternalStore<number | null>(subscribe, getSnapshot, () => null);
