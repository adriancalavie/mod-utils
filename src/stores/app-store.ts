import { Mod } from "@/models/mod";
import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";

type AppStoreState = {
  directory: string;
  mods: Mod[];
};

type AppStoreActions = {
  setDirectory: (directory: string) => Promise<void>;
  setMods: (mods: Mod[]) => void;
};

export type AppStore = AppStoreState & AppStoreActions;

export const useAppStore = create<AppStore>()((set) => ({
  directory: "",
  mods: [],
  setDirectory: async (directory: string) => {
    set({ directory });

    const { mods } = await invoke<{ mods: Mod[] }>("load_mods", { directory });
    console.log(`Loaded ${mods.length} mods`);
    set({ mods });
  },
  setMods: (mods: Mod[]) => {
    set({ mods });
  },
}));
