import { AppStore, useAppStore } from "@/stores/app-store";
import { useShallow } from "zustand/shallow";
import { DataTable } from "../ui/data-table";
import { Progress } from "../ui/progress";
import { columns } from "./columns";

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
      <div className="mx-auto flex w-full flex-col items-center">
        <div className="flex w-[60%] flex-col gap-2">
          <Progress value={computedProgress} />
          {progress.status} - {computedProgress.toFixed(2)}%
        </div>
      </div>
    );
  } else if (mods.length === 0) {
    return <div>No mods found</div>;
  } else if (mods.length > 0) {
    return <DataTable columns={columns} data={mods} />;
  } else {
    return null;
  }
}
