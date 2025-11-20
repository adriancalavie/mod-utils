import { Row } from "@tanstack/react-table";

const ORDER = {
  client: 0,
  server: 1,
  both: 2,
} as const;

export function sortByType<TData>(rowA: Row<TData>, rowB: Row<TData>) {
  const a = rowA.getValue<keyof typeof ORDER>("type");
  const b = rowB.getValue<keyof typeof ORDER>("type");
  return ORDER[a] - ORDER[b];
}
