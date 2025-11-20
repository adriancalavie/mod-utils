import { Mod } from "@/models/mod";
import { ArrowDown, ArrowUp } from "@nsmr/pixelart-react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { sortByType } from "./sorting";

const SortIndicator = ({
  sortStatus,
}: {
  sortStatus: ReturnType<Column<Mod>["getIsSorted"]>;
}) => {
  return (
    <span className="inline-flex size-6 items-center justify-center">
      {sortStatus === "asc" ? (
        <ArrowUp className="size-6" />
      ) : sortStatus === "desc" ? (
        <ArrowDown className="size-6" />
      ) : null}
    </span>
  );
};

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
        <SortIndicator sortStatus={column.getIsSorted()} />
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
        <SortIndicator sortStatus={column.getIsSorted()} />
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
