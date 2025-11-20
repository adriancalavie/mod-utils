import { Mod } from "@/models/mod";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { sortByType } from "./sorting";

export const columns: ColumnDef<Mod>[] = [
  {
    accessorKey: "name",
    size: 2, //fractional size
    sortingFn: "alphanumeric",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full text-left text-2xl select-none"
        onClick={column.getToggleSortingHandler()}
      >
        Mod Name
      </Button>
    ),
    cell: ({ row }) => (
      <div className="overflow-hidden text-lg text-ellipsis">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    size: 1, //fractional size
    sortingFn: sortByType,
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full text-left text-2xl select-none"
        onClick={column.getToggleSortingHandler()}
      >
        Type
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-left text-lg">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "version",
    size: 1, //fractional size
    header: () => (
      <div className="w-full px-2 text-right text-2xl select-none">Version</div>
    ),
    cell: ({ row }) => (
      <div className="overflow-hidden text-right text-lg text-ellipsis">
        {row.getValue("version")}
      </div>
    ),
  },
];
