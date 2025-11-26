import { Environment, Mod } from "@/models/mod";
import { ArrowDown, ArrowUp } from "@nsmr/pixelart-react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { toast } from "../ui/sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
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

const getFallbackName = (name: string) => {
  const capitals = name.match(/[A-Z]/g) ?? [];
  return `${capitals[0]}${capitals[1]}`;
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
    cell: ({ row }) => {
      const mod = row.original as Mod;
      const name = row.getValue("name") as string;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="flex w-full min-w-0 cursor-pointer items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(mod.fileName);
                toast({
                  title: "File name copied to clipboard",
                  description: mod.fileName,
                  button: {
                    label: "Dismiss",
                    onClick: () => {},
                  },
                });
              }}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={mod.iconUrl} />
                <AvatarFallback>{getFallbackName(name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 truncate text-lg">{name}</div>
            </div>
          </TooltipTrigger>
          <TooltipContent>{mod.fileName}</TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "type",
    size: 1, //fractional size
    sortingFn: sortByType,
    filterFn: (row, columnId, value: Environment[]) => {
      const rowValue = row.getValue(columnId) as Environment;
      return value.includes(rowValue);
    },
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
