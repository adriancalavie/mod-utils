import { Mod } from "@/models/mod";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Mod>[] = [
  {
    accessorKey: "name",
    size: 2, //fractional size
    header: () => <div className="text-2xl">Mod Name</div>,
    cell: ({ row }) => (
      <div className="overflow-hidden text-lg text-ellipsis">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    size: 1, //fractional size
    header: () => <div className="text-left text-2xl">Type</div>,
    cell: ({ row }) => (
      <div className="text-left text-lg">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "version",
    size: 110, //fixed size in pixels
    header: () => <div className="text-right text-2xl">Version</div>,
    cell: ({ row }) => (
      <div className="text-right text-lg">{row.getValue("version")}</div>
    ),
  },
];
