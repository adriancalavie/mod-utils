import { DataTable } from "@/components/ui/data-table";
import { Mod } from "@/models/mod";
import { useAppStore } from "@/stores/app-store";
import { useShallow } from "zustand/shallow";
import { columns } from "./columns";

export function ModsTable() {
  const data: Mod[] = useAppStore(useShallow(state => state.mods));

  return data.length > 0 ? <DataTable columns={columns} data={data} /> : <div>No mods found</div>;
}
