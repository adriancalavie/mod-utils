import { LoadingProgress } from "@/lib/types";
import { Mod } from "@/models/mod";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppStoreState = {
  directory: string;
  mods: Mod[];
  modsLoading: boolean;
  loadingProgress: LoadingProgress | null;
  sorting: SortingState;
  pagination: PaginationState;
};

type AppStoreActions = {
  setDirectory: (directory: string) => Promise<void>;
  setMods: (mods: Mod[]) => void;
  setProgress: (progress: LoadingProgress | null) => void;
  setLoading: (loading: boolean) => void;
  setSorting: (sorting: SortingState) => void;
  setPagination: (pagination: PaginationState) => void;
};

export type AppStore = AppStoreState & AppStoreActions;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      directory: "",
      mods: [],
      modsLoading: false,
      loadingProgress: null,
      sorting: [],
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
      setDirectory: async (directory: string) => {
        set({ directory });

        set({ modsLoading: true });
        const { mods } = await invoke<{ mods: Mod[] }>("load_mods", {
          directory,
        });
        set({ modsLoading: false });

        console.log(`Loaded ${mods.length} mods`);
        set({ mods });
      },
      setMods: (mods: Mod[]) => {
        set({ mods });
      },
      setProgress: (progress: LoadingProgress | null) => {
        set({ loadingProgress: progress });
      },
      setLoading: (loading: boolean) => {
        set({ modsLoading: loading });
      },
      setSorting: (sorting: SortingState) => {
        set({ sorting });
      },
      setPagination: (pagination: PaginationState) => {
        set({ pagination });
      },
    }),
    {
      name: "app-store",
      partialize: (state) => ({
        directory: state.directory,
        mods: state.mods,
        sorting: state.sorting,
        pagination: state.pagination,
      }),
    },
  ),
);
