import { ModsTable } from "@/components/mods/mods-table";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { LoadingProgress } from "@/lib/types";
import { Mod } from "@/models/mod";
import { AppStore, useAppStore } from "@/stores/app-store";
import { Folder, Reload } from "@nsmr/pixelart-react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/plugin-dialog";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import "./App.css";

const selector = (store: AppStore) => ({
  directory: store.directory,
  setDirectory: store.setDirectory,
  setMods: store.setMods,
  setProgress: store.setProgress,
  setLoading: store.setLoading,
});

function App() {
  const { directory, setDirectory, setMods, setProgress, setLoading } =
    useAppStore(useShallow(selector));

  const openDialog = async () => {
    const dir = await open({
      multiple: false,
      directory: true,
    });
    setDirectory(dir ?? "");
  };

  const refreshMods = async () => {
    setLoading(true);
    const { mods } = await invoke<{ mods: Mod[] }>("load_mods", { directory });
    setLoading(false);

    setMods(mods);
  };

  useEffect(() => {
    let unlisten = () => {};

    const setup = async () => {
      unlisten = await listen<LoadingProgress>("loading-progress", (event) => {
        setProgress(event.payload);

        /* Loading complete */
        if (event.payload.progress === 1.0) {
          setLoading(false);
        }
      });
    };

    setup();
    return () => {
      unlisten();
    };
  }, []);

  return (
    <ThemeProvider>
      <main
        className="h-screen w-full overflow-y-auto bg-black/1 dark:bg-black/40"
        style={{ colorScheme: "light dark" }}
      >
        <div className="p-8 text-black dark:text-white">
          <h1 className="mb-4 text-4xl font-bold">Alkazeroth's Mod Utils</h1>
          <div className="flex justify-between gap-4 select-none">
            <Button onClick={openDialog}>
              <Folder className="size-8" />
              Select folder
            </Button>
            {directory && (
              <Button onClick={refreshMods}>
                <Reload className="size-8" />
                Refresh mods
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="mt-4 overflow-hidden text-2xl text-ellipsis">
              {directory ? directory : "No folder selected"}
            </h2>
            <ModsTable />
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
