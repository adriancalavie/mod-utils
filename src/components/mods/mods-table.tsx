import { DataTable } from "@/components/ui/data-table";
import { columns, ModColumn } from "./columns";

export default function ModsTable() {
  const data: ModColumn[] = [
    {
      name: "AnvilNeverTooExpensive-neoforge-1.21+-1.2.1.jar",
      type: "client",
      version: "1.0.0",
    },
    { name: "Mod B", type: "server", version: "2.1.0" },
    { name: "Mod C", type: "both", version: "3.3.5" },
    {
      name: "AnvilNeverTooExpensive-neoforge-1.21+-1.2.1.jar",
      type: "client",
      version: "1.0.0",
    },
    { name: "Mod B", type: "server", version: "2.1.0" },
    { name: "Mod C", type: "both", version: "3.3.5" },

    {
      name: "AnvilNeverTooExpensive-neoforge-1.21+-1.2.1.jar",
      type: "client",
      version: "1.0.0",
    },
    { name: "Mod B", type: "server", version: "2.1.0" },
    { name: "Mod C", type: "both", version: "3.3.5" },

    {
      name: "AnvilNeverTooExpensive-neoforge-1.21+-1.2.1.jar",
      type: "client",
      version: "1.0.0",
    },
    { name: "Mod B", type: "server", version: "2.1.0" },
    { name: "Mod C", type: "both", version: "3.3.5" },

    {
      name: "AnvilNeverTooExpensive-neoforge-1.21+-1.2.1.jar",
      type: "client",
      version: "1.0.0",
    },
    { name: "Mod B", type: "server", version: "2.1.0" },
    { name: "Mod C", type: "both", version: "3.3.5" },
  ];

  return <DataTable columns={columns} data={data} />;
}
