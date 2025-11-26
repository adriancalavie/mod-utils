import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { applyUpdater } from "@/lib/utils";
import { AppStore, useAppStore } from "@/stores/app-store";
import { ArrowLeft, ArrowRight } from "@nsmr/pixelart-react";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Environment } from "@/models/mod";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const selector = (state: AppStore) => ({
  sorting: state.sorting,
  pagination: state.pagination,
  columnFilters: state.filtering,
  setSorting: state.setSorting,
  setPagination: state.setPagination,
  setFiltering: state.setFiltering,
});

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const {
    sorting,
    pagination,
    columnFilters,
    setSorting,
    setPagination,
    setFiltering,
  } = useAppStore(useShallow(selector));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (u) => setSorting(applyUpdater(sorting, u)),
    onPaginationChange: (u) => setPagination(applyUpdater(pagination, u)),
    onColumnFiltersChange: (u) => setFiltering(applyUpdater(columnFilters, u)),
    enableMultiSort: true,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
  });

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && table.getCanPreviousPage()) {
        table.previousPage();
      } else if (event.key === "ArrowRight" && table.getCanNextPage()) {
        table.nextPage();
      }
    };

    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  const gridTemplateColumns = columns
    .map((col) => {
      if (col.size === undefined || col.size < 10) {
        return `${col.size || 1}fr`;
      }
      return `${col.size}px`;
    })
    .join(" ");

  const typeCol = table.getColumn("type");

  const isChecked = (type: Environment) => {
    const valueArray = (typeCol?.getFilterValue() as Environment[]) || [];
    return valueArray.includes(type);
  };

  const toggleChecked = (type: Environment) => {
    const valueArray = (typeCol?.getFilterValue() as Environment[]) || [];
    const newValueArray = valueArray.includes(type)
      ? valueArray.filter((t) => t !== type)
      : [...valueArray, type];
    typeCol?.setFilterValue(newValueArray);
  };

  return (
    <div>
      <div className="flex items-center justify-end gap-1 py-2 select-none">
        <Input
          placeholder="Filter mods..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Type</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={isChecked("client")}
              onCheckedChange={() => toggleChecked("client")}
            >
              client
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={isChecked("server")}
              onCheckedChange={() => toggleChecked("server")}
            >
              server
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={isChecked("both")}
              onCheckedChange={() => toggleChecked("both")}
            >
              both
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Mods per page</SelectLabel>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="default"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft className="size-6" />
        </Button>
        <Button
          variant="outline"
          size="default"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRight className="size-6" />
        </Button>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden border">
        <div className="flex-1 overflow-y-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  style={{ display: "grid", gridTemplateColumns, gap: 0 }}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    style={{ display: "grid", gridTemplateColumns, gap: 0 }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
