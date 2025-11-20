import { AppStore, useAppStore } from "@/stores/app-store";
import { useShallow } from "zustand/shallow";
import { DataTable } from "../ui/data-table";
import { columns } from "./columns";
import { LoadingProgress } from "./loading";

const selector = (state: AppStore) => ({
  mods: state.mods,
  loading: state.modsLoading,
  progress: state.loadingProgress,
});

export function ModsTable() {
  const { mods, loading, progress } = useAppStore(useShallow(selector));

  const computedProgress = (progress?.progress ?? 0) * 100;

  if (loading && progress) {
    return (
      <LoadingProgress value={computedProgress} status={progress.status} />
    );
  }

  if (mods.length === 0) {
    return <p className="text-center">No mods found</p>;
  }

  return <DataTable columns={columns} data={mods} />;
}
