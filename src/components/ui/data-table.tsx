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
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { Controls } from "./data-table-controls";

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

  // Define your grid template here; matches your desired column ratios
  const gridTemplateColumns = "2fr 1fr 1fr";

  return (
    <div className="flex h-full w-full flex-col">
      <Controls table={table} />
      <div className="flex-1 overflow-hidden border">
        <div className="w-full overflow-y-auto">
          <Table className="block w-full">
            <TableHeader className="block">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className={`grid w-full`}
                  style={{ gridTemplateColumns }}
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="block">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="grid w-full"
                    style={{ gridTemplateColumns }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow
                  className="grid w-full"
                  style={{ gridTemplateColumns: `1fr` }}
                >
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
