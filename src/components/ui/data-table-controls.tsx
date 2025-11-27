import { ArrowLeft, ArrowRight } from "@nsmr/pixelart-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "./dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "./select";
import { Table } from "@tanstack/react-table";
import { Button } from "./button";
import { Input } from "./input";
import { Environment } from "@/models/mod";

type ControlsProps<TData> = {
  table: Table<TData>;
};

export function Controls<TData>({ table }: ControlsProps<TData>) {
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
  );
}
